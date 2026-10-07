import { useLingui } from '@lingui/react/macro';

import { CategoryCombobox } from '@/modules/category';
import { attributeTypeOptions } from '@/modules/products';
import { useAppForm } from '@/shared/ui/form/hooks';
import { Label } from '@/shared/ui/label';
import { SelectItem } from '@/shared/ui/select';

import type { AttributeFormSchema } from './constants';

import { attributeFormSchema } from './constants';

interface AttributeFormProps {
  defaultValues?: Partial<Attribute>;
  onSubmit: (values: AttributeFormSchema) => void;
}

export const AttributeForm = ({ defaultValues, onSubmit }: AttributeFormProps) => {
  const { t } = useLingui();

  const form = useAppForm({
    validators: {
      onChange: attributeFormSchema()
    },
    defaultValues: {
      attribute_type: defaultValues?.attribute_type ?? 'text',
      name_uz: defaultValues?.name_uz ?? '',
      name_en: defaultValues?.name_en ?? '',
      name_ru: defaultValues?.name_ru ?? '',
      is_filterable: defaultValues?.is_filterable ?? false,
      category: defaultValues?.category
        ? {
            value: String(defaultValues.category.id),
            label: defaultValues.category.name
          }
        : null
    } satisfies AttributeFormSchema as AttributeFormSchema,
    onSubmit: ({ value }) => onSubmit(value)
  });

  return (
    <form.AppForm>
      <form
        className='grid gap-4'
        id='attribute-form'
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.AppField name='name_uz'>
          {(field) => (
            <field.Input
              isRequired
              label={`${t`Name`} (UZ)`}
              placeholder={t`Example: Color, Size`}
            />
          )}
        </form.AppField>
        <form.AppField name='name_ru'>
          {(field) => (
            <field.Input
              isRequired
              label={`${t`Name`} (RU)`}
              placeholder={t`Example: Color, Size`}
            />
          )}
        </form.AppField>
        <form.AppField name='name_en'>
          {(field) => (
            <field.Input
              isRequired
              label={`${t`Name`} (EN)`}
              placeholder={t`Example: Color, Size`}
            />
          )}
        </form.AppField>
        <form.AppField name='category'>
          {(field) => (
            <div className='space-y-2'>
              <Label>{t`Category`}</Label>
              <CategoryCombobox value={field.state.value} onValueChange={field.handleChange} />
            </div>
          )}
        </form.AppField>
        <form.AppField name='attribute_type'>
          {(field) => (
            <field.Select
              isRequired
              items={attributeTypeOptions.map((item) => ({
                label: t(item.label),
                value: item.value
              }))}
              label={t`Type`}
              placeholder={t`Select type`}
            >
              {attributeTypeOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {t(item.label)}
                </SelectItem>
              ))}
            </field.Select>
          )}
        </form.AppField>
        <form.AppField name='is_filterable'>
          {(field) => <field.Checkbox label={t`Use as catalog filter`} />}
        </form.AppField>
      </form>
    </form.AppForm>
  );
};
