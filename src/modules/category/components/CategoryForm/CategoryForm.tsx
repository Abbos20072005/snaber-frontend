import { useLingui } from '@lingui/react/macro';

import { CategoryCombobox } from '@/modules/category';
import { useFileFetcher } from '@/shared/hooks/use-file-fetcher';
import { useAppForm } from '@/shared/ui/form/hooks';
import { Label } from '@/shared/ui/label.tsx';

import type { CategoryFormSchema } from './constants';

import { categoryFormSchema } from './constants';

interface Props {
  defaultValues?: Partial<Category>;
  onSubmit?: (value: CategoryFormSchema) => void;
}

export const CategoryForm = ({ defaultValues, onSubmit }: Props) => {
  const { t } = useLingui();

  const links = defaultValues?.image ? [defaultValues.image] : [];

  const { isLoading, isError, files } = useFileFetcher({ links });

  const form = useAppForm({
    validators: {
      onChange: categoryFormSchema()
    },
    defaultValues: {
      name_en: defaultValues?.name_en || '',
      name_ru: defaultValues?.name_ru || '',
      name_uz: defaultValues?.name_uz || '',
      code: defaultValues?.code ?? '',
      image: isLoading && !isError ? [] : files,
      is_active: !!defaultValues?.is_active,
      parent: defaultValues?.parent
        ? {
            value: String(defaultValues.parent.id),
            label: defaultValues.parent.name
          }
        : null
    } satisfies CategoryFormSchema as CategoryFormSchema,
    onSubmit: ({ value }) => {
      onSubmit?.(value);
    }
  });

  return (
    <form.AppForm>
      <form
        className='space-y-4'
        id='category-form'
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div className='grid gap-3'>
          <form.AppField name='code'>
            {(field) => (
              <field.Input isRequired label={t`Code`} placeholder={t`Enter category code`} />
            )}
          </form.AppField>
        </div>
        <div className='mt-4 grid gap-3'>
          <form.AppField name='name_uz'>
            {(field) => (
              <field.Input
                isRequired
                label={`${t`Name`} (UZ)`}
                placeholder={t`Enter category name`}
              />
            )}
          </form.AppField>
          <form.AppField name='name_ru'>
            {(field) => (
              <field.Input
                isRequired
                label={`${t`Name`} (RU)`}
                placeholder={t`Enter category name`}
              />
            )}
          </form.AppField>
          <form.AppField name='name_en'>
            {(field) => (
              <field.Input
                isRequired
                label={`${t`Name`} (EN)`}
                placeholder={t`Enter category name`}
              />
            )}
          </form.AppField>
          <form.AppField name='parent'>
            {(field) => (
              <div className='space-y-2'>
                <Label className='text-xs'>{t`Parent category`}</Label>
                <CategoryCombobox value={field.state.value} onValueChange={field.handleChange} />
              </div>
            )}
          </form.AppField>
          <form.AppField name='is_active'>
            {(field) => <field.Checkbox isRequired label={`${t`Is active`}`} />}
          </form.AppField>
        </div>
        <div className='mt-4 grid grid-cols-1 gap-3'>
          <form.AppField name='image'>
            {(field) => (
              <field.FileUpload
                isRequired
                accept='image/*'
                label={t`Image`}
                maxFiles={1}
                selectText={t`Select image`}
                loading={isLoading}
                loadingText={t`Loading image...`}
              />
            )}
          </form.AppField>
        </div>
      </form>
    </form.AppForm>
  );
};
