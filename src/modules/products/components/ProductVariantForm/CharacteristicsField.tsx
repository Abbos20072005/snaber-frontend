import { useLingui } from '@lingui/react/macro';
import { PlusIcon, Trash2Icon } from 'lucide-react';

import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

import type { ProductVariantSchemaForm } from './constants';
import type { ProductVariantAnyField, ProductVariantFormApi } from './types';

interface CharacteristicsFieldProps {
  form: ProductVariantFormApi;
}

export const CharacteristicsField = ({ form }: CharacteristicsFieldProps) => {
  const { t } = useLingui();

  return (
    <form.AppField name='characteristics'>
      {(field: ProductVariantAnyField) => (
        <div className='grid gap-3'>
          <div className='flex items-center justify-between gap-2'>
            <p className='text-sm font-medium'>{t`Characteristics`}</p>
            <Button
              size='sm'
              type='button'
              variant='outline'
              onClick={() => field.handleChange([...field.state.value, { name: '', value: '' }])}
            >
              <PlusIcon />
              {t`Add`}
            </Button>
          </div>
          {field.state.value.length === 0 && (
            <div className='border-border text-muted-foreground rounded-md border border-dashed p-4 text-sm'>
              {t`No characteristics added.`}
            </div>
          )}
          {field.state.value.map(
            (item: ProductVariantSchemaForm['characteristics'][number], index: number) => (
            <div key={index} className='grid gap-2 md:grid-cols-[1fr_1fr_auto]'>
              <Input
                value={item.name}
                onChange={(event) => {
                  const next = [...field.state.value];
                  next[index] = { ...item, name: event.target.value };
                  field.handleChange(next);
                }}
                placeholder={t`Name`}
              />
              <Input
                value={item.value}
                onChange={(event) => {
                  const next = [...field.state.value];
                  next[index] = { ...item, value: event.target.value };
                  field.handleChange(next);
                }}
                placeholder={t`Value`}
              />
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
          )
          )}
        </div>
      )}
    </form.AppField>
  );
};
