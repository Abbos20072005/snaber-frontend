import { useLingui } from '@lingui/react/macro';
import { PlusIcon, Trash2Icon } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { SelectItem } from '@/shared/ui/select';

import type { ProductVariantSchemaForm } from './constants';
import type { ProductVariantAnyField, ProductVariantFormApi } from './types';

import {
  getAvailableAttributes,
  getSelectedAttributeValues,
  toAttributeSelectItems,
  toAttributeValueSelectItems
} from './helpers';

interface VariantAttributesFieldProps {
  attributes: Attribute[];
  attributeValuesByAttribute: Map<number, AttributeValue[]>;
  form: ProductVariantFormApi;
  isAttributesLoading: boolean;
}

export const VariantAttributesField = ({
  attributeValuesByAttribute,
  attributes,
  form,
  isAttributesLoading
}: VariantAttributesFieldProps) => {
  const { t } = useLingui();

  return (
    <form.AppField name='attributes'>
      {(field: ProductVariantAnyField) => (
        <div className='grid gap-3'>
          <div className='flex items-center justify-between gap-2'>
            <p className='text-sm font-medium'>{t`Attributes`}</p>
            <Button
              disabled={
                isAttributesLoading ||
                attributes.length === 0 ||
                new Set(
                  field.state.value
                    .map((item: ProductVariantSchemaForm['attributes'][number]) => item.attribute.value)
                    .filter((value: string) => value.length > 0)
                ).size >= attributes.length
              }
              size='sm'
              type='button'
              variant='outline'
              onClick={() =>
                field.handleChange([
                  ...field.state.value,
                  { attribute: { value: '', label: '' }, value: '' }
                ])
              }
            >
              <PlusIcon />
              {t`Add`}
            </Button>
          </div>
          {field.state.value.length === 0 && (
            <div className='border-border text-muted-foreground rounded-md border border-dashed p-4 text-sm'>
              {t`No attributes added.`}
            </div>
          )}
          {field.state.value.map(
            (item: ProductVariantSchemaForm['attributes'][number], index: number) => {
            const selectedAttributeValues = getSelectedAttributeValues(field.state.value, index);
            const availableAttributes = getAvailableAttributes(
              attributes,
              item.attribute.value,
              selectedAttributeValues
            );
            const availableAttributeValues =
              attributeValuesByAttribute.get(Number(item.attribute.value)) ?? [];

            return (
              <div key={index} className='grid gap-2 md:grid-cols-[1fr_1fr_auto]'>
                <form.AppField name={`attributes.${index}.attribute.value` as never}>
                  {(attributeField: ProductVariantAnyField) => (
                    <attributeField.Select
                      disabled={isAttributesLoading || availableAttributes.length === 0}
                      items={toAttributeSelectItems(availableAttributes)}
                      label={t`Attribute`}
                      value={item.attribute.value}
                      onValueChange={(value: string | null) => {
                        const nextValue = (value as string | null) ?? '';
                        const attribute = attributes.find((attr) => `${attr.id}` === nextValue);
                        const next = [...field.state.value];

                        next[index] = {
                          ...item,
                          attribute: {
                            value: nextValue,
                            label: attribute?.name ?? ''
                          },
                          value: ''
                        };
                        field.handleChange(next);
                      }}
                      placeholder={t`Select attribute`}
                    >
                      {availableAttributes.map((attribute) => (
                        <SelectItem key={attribute.id} value={`${attribute.id}`}>
                          {attribute.name}
                        </SelectItem>
                      ))}
                    </attributeField.Select>
                  )}
                </form.AppField>
                <form.AppField name={`attributes.${index}.value` as never}>
                  {(valueField: ProductVariantAnyField) => (
                    <valueField.Select
                      disabled={
                        isAttributesLoading ||
                        !item.attribute.value ||
                        availableAttributeValues.length === 0
                      }
                      items={toAttributeValueSelectItems(availableAttributeValues)}
                      label={t`Value`}
                      value={item.value}
                      onValueChange={(value: string | null) => {
                        const next = [...field.state.value];
                        next[index] = { ...item, value: (value as string | null) ?? '' };
                        field.handleChange(next);
                      }}
                      placeholder={t`Select value`}
                    >
                      {availableAttributeValues.map((attributeValue) => (
                        <SelectItem key={attributeValue.id} value={`${attributeValue.id}`}>
                          {attributeValue.value}
                        </SelectItem>
                      ))}
                    </valueField.Select>
                  )}
                </form.AppField>
                <Button
                  size='icon'
                  type='button'
                  variant='ghost'
                  onClick={() =>
                    field.handleChange(
                      field.state.value.filter((_: unknown, itemIndex: number) => itemIndex !== index)
                    )
                  }
                >
                  <Trash2Icon />
                </Button>
              </div>
            );
          }
          )}
        </div>
      )}
    </form.AppField>
  );
};
