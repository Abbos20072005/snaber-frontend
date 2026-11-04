import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { postAttributeValue } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';

import { PRODUCT_QUERY_KEYS } from '../../options';

interface Props {
  attributeId: number;
  onCreated?: (value: AttributeValue) => void;
}

// Adds a new option (e.g. a size) to an axis without leaving the page.
export const NewAttributeValue = ({ attributeId, onCreated }: Props) => {
  const { t } = useLingui();
  const [value, setValue] = useState('');

  const createValueMutation = useMutation({
    mutationFn: () =>
      postAttributeValue({
        data: {
          attribute: attributeId,
          value_en: value.trim(),
          value_ru: value.trim(),
          value_uz: value.trim()
        }
      }),
    onSuccess: ({ data }) => {
      setValue('');
      onCreated?.(data);
    },
    onError: () => toast.error(t`Failed to create the option.`),
    meta: {
      invalidatesQuery: [...PRODUCT_QUERY_KEYS.base()],
      withoutToastOnError: true
    }
  });

  const onCreate = () => {
    if (value.trim()) createValueMutation.mutate();
  };

  return (
    <div className='flex gap-2'>
      <Input
        className='h-8'
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key !== 'Enter') return;
          event.preventDefault();
          onCreate();
        }}
        placeholder={t`New option`}
      />
      <Button
        aria-label={t`Add option`}
        disabled={!value.trim()}
        size='icon-sm'
        type='button'
        variant='outline'
        loading={createValueMutation.isPending}
        onClick={onCreate}
      >
        <PlusIcon />
      </Button>
    </div>
  );
};
