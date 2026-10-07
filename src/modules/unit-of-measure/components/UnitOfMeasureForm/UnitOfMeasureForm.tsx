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
      unit: defaultValues?.unit ?? ''
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
        <form.AppField name='unit'>
          {(field) => (
            <field.Input
              isRequired
              label={t`Unit`}
              placeholder={t`Enter unit of measure`}
            />
          )}
        </form.AppField>
      </form>
    </form.AppForm>
  );
};
