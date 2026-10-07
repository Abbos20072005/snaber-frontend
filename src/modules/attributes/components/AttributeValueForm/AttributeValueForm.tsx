import { useLingui } from '@lingui/react/macro';
import { useQuery } from '@tanstack/react-query';

import { useFileFetcher } from '@/shared/hooks/use-file-fetcher.ts';
import { useAppForm } from '@/shared/ui/form/hooks';
import { SelectItem } from '@/shared/ui/select';

import type { AttributeValueFormSchema } from './constants';

import { getAllAttributesByCategoryQueryOptions } from '../../options';
import { attributeValueFormSchema } from './constants';

interface AttributeValueFormProps {
  defaultValues?: Partial<AttributeValue>;
  formId?: string;
  onSubmit: (values: AttributeValueFormSchema) => void;
}

export const AttributeValueForm = ({
  defaultValues,
  formId = 'attribute-value-form',
  onSubmit
}: AttributeValueFormProps) => {
  const { t } = useLingui();
  const attributesQuery = useQuery(getAllAttributesByCategoryQueryOptions());
  const attributes = attributesQuery.data?.data ?? [];

  const links = defaultValues?.image ? [defaultValues.image] : [];
  const { isLoading, isError, files } = useFileFetcher({ links });

  const form = useAppForm({
    validators: {
      onChange: attributeValueFormSchema()
    },
    defaultValues: {
      value_uz: defaultValues?.value ?? '',
      value_ru: defaultValues?.value ?? '',
      value_en: defaultValues?.value ?? '',
      attribute: defaultValues?.attribute
        ? {
            value: String(defaultValues.attribute.id),
            label: defaultValues.attribute.name
          }
        : null,
      image: isLoading && !isError ? [] : files
    } satisfies AttributeValueFormSchema as AttributeValueFormSchema,
    onSubmit: ({ value }) => onSubmit(value)
  });

  return (
    <form.AppForm>
      <form
        className='grid gap-4'
        id={formId}
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.AppField name='attribute'>
          {(field) => (
            <field.Select
              isRequired
              items={attributes.map((attribute) => ({
                label: attribute.name,
                value: String(attribute.id)
              }))}
              disabled={attributesQuery.isLoading}
              label={t`Attribute`}
              value={field.state.value?.value ?? ''}
              onValueChange={(value) => {
                const nextValue = String(value);
                const attribute = attributes.find((item) => String(item.id) === nextValue);
                field.handleChange({
                  label: attribute?.name ?? `#${nextValue}`,
                  value: nextValue
                });
              }}
              placeholder={t`Select attribute`}
            >
              {attributes.map((attribute) => (
                <SelectItem key={attribute.id} value={String(attribute.id)}>
                  {attribute.name}
                </SelectItem>
              ))}
            </field.Select>
          )}
        </form.AppField>
        <form.AppField name='value_uz'>
          {(field) => (
            <field.Input isRequired label={`${t`Value`} (UZ)`} placeholder={t`Example: Blue`} />
          )}
        </form.AppField>
        <form.AppField name='value_ru'>
          {(field) => (
            <field.Input isRequired label={`${t`Value`} (RU)`} placeholder={t`Example: Blue`} />
          )}
        </form.AppField>
        <form.AppField name='value_en'>
          {(field) => (
            <field.Input isRequired label={`${t`Value`} (EN)`} placeholder={t`Example: Blue`} />
          )}
        </form.AppField>
        <form.AppField name='image'>
          {(field) => (
            <field.FileUpload
              accept='image/*'
              label={t`Image`}
              maxFiles={1}
              selectText={t`Select image`}
              loading={isLoading}
              loadingText={t`Loading image...`}
            />
          )}
        </form.AppField>
      </form>
    </form.AppForm>
  );
};
