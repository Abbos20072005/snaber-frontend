import { useLingui } from '@lingui/react/macro';

import { useAppForm } from '@/shared/ui/form/hooks';

import type { UnitOfMeasureSchema } from './constants';

import { unitOfMeasureSchema } from './constants';

interface UnitOfMeasureFormProps {
  defaultValues?: Partial<UnitOfMeasure>;
  onSubmit: (values: UnitOfMeasureSchema) => void;
}

export const UnitOfMeasureForm = ({ defaultValues, onSubmit }: UnitOfMeasureFormProps) => {
  const { t } = useLingui();

  const form = useAppForm({
    validators: {
      onChange: unitOfMeasureSchema()
    },
    defaultValues: {
      unit_en: defaultValues?.unit_en ?? '',
      unit_ru: defaultValues?.unit_ru ?? '',
      unit_uz: defaultValues?.unit_uz ?? ''
    } satisfies UnitOfMeasureSchema,
    onSubmit: ({ value }) => {
      onSubmit(value);
    }
  });

  return (
    <form.AppForm>
      <form
        className='space-y-4'
        id='unit-form'
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.AppField name='unit_uz'>
          {(field) => (
            <field.Input
              isRequired
              label={`${t`Unit`} (UZ)`}
              placeholder={t`Enter unit of measure`}
            />
          )}
        </form.AppField>
        <form.AppField name='unit_ru'>
          {(field) => <field.Input label={`${t`Unit`} (RU)`} />}
        </form.AppField>
        <form.AppField name='unit_en'>
          {(field) => <field.Input label={`${t`Unit`} (EN)`} />}
        </form.AppField>
      </form>
    </form.AppForm>
  );
};
