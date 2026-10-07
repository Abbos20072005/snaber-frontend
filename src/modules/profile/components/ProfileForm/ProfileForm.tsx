import { useLingui } from '@lingui/react/macro';
import { useQuery } from '@tanstack/react-query';
import { CameraIcon, ImageIcon, LoaderCircleIcon, Trash2Icon } from 'lucide-react';
import React, { useEffect, useId, useMemo, useRef } from 'react';

import { getCountryNameMap, getCountryOptions, getCountryQueryOptions } from '@/modules/country';
import {
  currencyFlagMap,
  currencyLabelMap,
  currencyOptions,
  currencySymbolMap,
  defaultCurrencyCode,
  getCurrencyQueryOptions
} from '@/modules/currency';
import { useFileFetcher } from '@/shared/hooks/use-file-fetcher';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/shared/ui/field';
import { useAppForm } from '@/shared/ui/form/hooks';
import { SelectItem } from '@/shared/ui/select';
import { Skeleton } from '@/shared/ui/skeleton';

import type { ProfileFormSchema } from './constants';

import { profileFormSchema } from './constants';

interface Props {
  defaultValues?: Partial<User>;
  formId: string;
  onSubmit?: (value: ProfileFormSchema) => void;
}

interface ProfileImageUploadProps {
  description: string;
  disabled?: boolean;
  errors?: Array<{ message?: string } | undefined>;
  fullName: string;
  isInvalid: boolean;
  label: string;
  loading?: boolean;
  loadingText: string;
  removeText: string;
  selectText: string;
  value: File[];
  onValueChange: (files: File[]) => void;
}

const ProfileImageUpload = ({
  description,
  disabled,
  errors,
  fullName,
  isInvalid,
  label,
  loading,
  loadingText,
  removeText,
  selectText,
  value,
  onValueChange
}: ProfileImageUploadProps) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const file = value[0];
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const previewUrl = useMemo(() => {
    if (!file) return null;

    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0];
    if (nextFile) onValueChange([nextFile]);
    event.target.value = '';
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const nextFile = Array.from(event.dataTransfer.files).find((item) =>
      item.type.startsWith('image/')
    );

    if (nextFile) onValueChange([nextFile]);
  };

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
      <div
        className={cn(
          'border-border bg-muted/20 hover:bg-muted/40 relative flex flex-col gap-4 rounded-lg border border-dashed p-4 transition-colors sm:flex-row sm:items-center',
          isInvalid && 'border-destructive ring-destructive/20 ring-3',
          disabled && 'pointer-events-none opacity-60'
        )}
        aria-disabled={disabled || loading}
        aria-invalid={isInvalid}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        role='region'
      >
        <div className='relative mx-auto size-24 shrink-0 sm:mx-0'>
          {loading ? (
            <Skeleton className='size-24 rounded-full' />
          ) : previewUrl ? (
            <img
              alt={file?.name ?? label}
              className='border-background size-24 rounded-full border-4 object-cover shadow-sm'
              src={previewUrl}
            />
          ) : (
            <div className='bg-background text-muted-foreground flex size-24 items-center justify-center rounded-full border shadow-sm'>
              {initials ? (
                <span className='text-2xl font-medium'>{initials}</span>
              ) : (
                <ImageIcon className='size-8' />
              )}
            </div>
          )}
          <span className='bg-primary text-primary-foreground ring-background absolute right-1 bottom-1 flex size-8 items-center justify-center rounded-full ring-2'>
            {loading ? (
              <LoaderCircleIcon className='size-4 animate-spin' />
            ) : (
              <CameraIcon className='size-4' />
            )}
          </span>
        </div>

        <div className='min-w-0 flex-1 space-y-3 text-center sm:text-left'>
          <div className='space-y-1'>
            <p className='text-sm font-medium'>{loading ? loadingText : selectText}</p>
            <FieldDescription className='mx-auto max-w-sm sm:mx-0'>{description}</FieldDescription>
          </div>
          <div className='flex flex-wrap justify-center gap-2 sm:justify-start'>
            <Button
              disabled={disabled || loading}
              size='sm'
              type='button'
              variant='outline'
              onClick={() => inputRef.current?.click()}
            >
              <CameraIcon />
              {selectText}
            </Button>
            {file && !loading && (
              <Button
                disabled={disabled}
                size='sm'
                type='button'
                variant='destructive'
                onClick={(event) => {
                  event.stopPropagation();
                  onValueChange([]);
                }}
              >
                <Trash2Icon />
                {removeText}
              </Button>
            )}
          </div>
        </div>

        <input
          ref={inputRef}
          accept='image/*'
          className='sr-only'
          disabled={disabled || loading}
          id={inputId}
          type='file'
          onChange={handleFileChange}
        />
      </div>
      {(description || isInvalid) && (
        <FieldContent>{isInvalid && <FieldError errors={errors} />}</FieldContent>
      )}
    </Field>
  );
};

export const ProfileForm = ({ defaultValues, onSubmit, formId }: Props) => {
  const { t } = useLingui();

  const countriesQuery = useQuery(getCountryQueryOptions());
  const currenciesQuery = useQuery(getCurrencyQueryOptions());

  const imageLinks = defaultValues?.image ? [defaultValues.image] : [];
  const countryOptions = getCountryOptions(countriesQuery.data?.data);
  const countryNameMap = getCountryNameMap(countriesQuery.data?.data);
  const availableCurrencyCodes =
    currenciesQuery.data?.data.map((currency) => currency.code) ??
    currencyOptions.map(({ value }) => value);

  const { files, isError, isLoading } = useFileFetcher({
    links: imageLinks,
    enabled: imageLinks.length > 0
  });

  const form = useAppForm({
    validators: {
      onChange: profileFormSchema()
    },
    defaultValues: {
      full_name: defaultValues?.full_name || '',
      email: defaultValues?.email || '',
      phone_number: defaultValues?.phone_number || '',
      country: defaultValues?.country || '',
      currency: defaultValues?.currency || defaultCurrencyCode,
      image: !isError && isLoading ? [] : files
    } satisfies ProfileFormSchema as ProfileFormSchema,
    onSubmit: ({ value }) => {
      onSubmit?.(value);
    }
  });

  useEffect(() => {
    if (imageLinks.length === 0) return;
    if (isLoading || isError) return;
    if (files.length !== imageLinks.length) return;

    const currentFiles = form.getFieldValue('image');
    const isAlreadySet =
      currentFiles.length === files.length &&
      currentFiles.every((file, index) => file === files[index]);

    if (!isAlreadySet) form.setFieldValue('image', files);
  }, [files, form, imageLinks.length, isError, isLoading]);

  return (
    <form.AppForm>
      <form
        className='space-y-4'
        id={formId}
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.AppField name='image'>
          {(field) => (
            <ProfileImageUpload
              fullName={form.getFieldValue('full_name') || defaultValues?.full_name || ''}
              isInvalid={field.state.meta.isTouched && !field.state.meta.isValid}
              label={t`Profile image`}
              selectText={t`Change photo`}
              value={field.state.value || []}
              description={t`Drop a new image here or choose a clear square photo.`}
              errors={field.state.meta.errors}
              loading={isLoading}
              loadingText={t`Loading photo...`}
              onValueChange={field.handleChange}
              removeText={t`Remove`}
            />
          )}
        </form.AppField>
        <div className='grid gap-4 sm:grid-cols-2'>
          <form.AppField name='full_name'>
            {(field) => <field.Input isRequired label={t`Full name`} placeholder='Abdurahmon' />}
          </form.AppField>
          <form.AppField name='phone_number'>
            {(field) => (
              <field.PhoneInput isRequired label={t`Phone number`} placeholder='99112223344' />
            )}
          </form.AppField>
        </div>
        <form.AppField name='email'>
          {(field) => (
            <field.Input
              disabled
              isRequired
              label='Email'
              type='email'
              placeholder='mirmaxsudov@gmail.com'
            />
          )}
        </form.AppField>
        <div className='grid gap-4 sm:grid-cols-2'>
          <form.AppField name='country'>
            {(field) => (
              <field.Select
                isRequired
                disabled={countriesQuery.isLoading}
                label={t`Country`}
                renderValue={(value) => countryNameMap[value] || value}
                placeholder={countriesQuery.isLoading ? t`Loading countries...` : t`Select country`}
              >
                {countryOptions.map((country) => (
                  <SelectItem key={country.value} value={country.value}>
                    <span className='min-w-0 flex-1 truncate'>{country.label}</span>
                    <span className='text-muted-foreground ml-auto text-xs'>{country.value}</span>
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>
          <form.AppField name='currency'>
            {(field) => (
              <field.Select
                isRequired
                renderValue={(value) => {
                  const currencyCode = value as CurrencyCode;

                  return (
                    <>
                      <span className={`fi fi-${currencyFlagMap[currencyCode]}`} />
                      <span>{t(currencyLabelMap[currencyCode])}</span>
                      <span className='text-muted-foreground ml-auto text-xs'>
                        {currencySymbolMap[currencyCode]}
                      </span>
                    </>
                  );
                }}
                disabled={currenciesQuery.isLoading}
                label={t`Currency`}
                placeholder={
                  currenciesQuery.isLoading ? t`Loading currencies...` : t`Select currency`
                }
              >
                {availableCurrencyCodes.map((code) => (
                  <SelectItem key={code} value={code}>
                    <span className={`fi fi-${currencyFlagMap[code]}`} />
                    <span className='min-w-0 flex-1 truncate'>{t(currencyLabelMap[code])}</span>
                    <span className='text-muted-foreground ml-auto text-xs'>
                      {code} · {currencySymbolMap[code]}
                    </span>
                  </SelectItem>
                ))}
              </field.Select>
            )}
          </form.AppField>
        </div>
      </form>
    </form.AppForm>
  );
};
