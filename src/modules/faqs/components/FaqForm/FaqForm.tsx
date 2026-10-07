import { useLingui } from '@lingui/react/macro';

import { useAppForm } from '@/shared/ui/form/hooks';

import type { FaqFormSchema } from './constants';

import { faqFormSchema } from './constants';

interface Props {
  defaultValues?: Partial<Faq>;
  onSubmit?: (value: FaqFormSchema) => void;
}

export const FaqForm = ({ defaultValues, onSubmit }: Props) => {
  const { t } = useLingui();

  const form = useAppForm({
    validators: {
      onChange: faqFormSchema()
    },
    defaultValues: {
      name_en: defaultValues?.name_en || '',
      name_ru: defaultValues?.name_ru || '',
      name_uz: defaultValues?.name_uz || '',
      description_en: defaultValues?.description_en || '',
      description_ru: defaultValues?.description_ru || '',
      description_uz: defaultValues?.description_uz || ''
    } satisfies FaqFormSchema as FaqFormSchema,
    onSubmit: ({ value }) => {
      onSubmit?.(value);
    }
  });

  return (
    <form.AppForm>
      <form
        className='space-y-4'
        id='faq-form'
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <div className='mt-4 grid gap-3'>
          <form.AppField name='name_uz'>
            {(field) => (
              <field.Input
                isRequired
                label={`${t`Question`} (UZ)`}
                placeholder={t`Enter category name`}
              />
            )}
          </form.AppField>
          <form.AppField name='name_ru'>
            {(field) => (
              <field.Input
                isRequired
                label={`${t`Question`} (RU)`}
                placeholder={t`Enter category name`}
              />
            )}
          </form.AppField>
          <form.AppField name='name_en'>
            {(field) => (
              <field.Input
                isRequired
                label={`${t`Question`} (EN)`}
                placeholder={t`Enter category name`}
              />
            )}
          </form.AppField>

          <form.AppField name='description_uz'>
            {(field) => (
              <field.Input
                isRequired
                label={`${t`Answer`} (UZ)`}
                placeholder={t`Enter category name`}
              />
            )}
          </form.AppField>
          <form.AppField name='description_ru'>
            {(field) => (
              <field.Input
                isRequired
                label={`${t`Answer`} (RU)`}
                placeholder={t`Enter category name`}
              />
            )}
          </form.AppField>
          <form.AppField name='description_en'>
            {(field) => (
              <field.Input
                isRequired
                label={`${t`Answer`} (EN)`}
                placeholder={t`Enter category name`}
              />
            )}
          </form.AppField>
        </div>
      </form>
    </form.AppForm>
  );
};
