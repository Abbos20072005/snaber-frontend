import { useLingui } from '@lingui/react/macro';
import { ChevronRightIcon } from 'lucide-react';

import { Button } from '@/shared/ui/button.tsx';

const MAX_VISIBLE_ROWS = 6;

interface PublicProductSummaryProps {
  selectedVariant?: ProductVariant;
  onShowAll: () => void;
}

export const PublicProductSummary = ({ selectedVariant, onShowAll }: PublicProductSummaryProps) => {
  const { t } = useLingui();

  const rows = [
    ...(selectedVariant?.attributes.map((attribute) => ({
      name: attribute.name,
      value: attribute.value.value
    })) ?? []),
    ...(selectedVariant?.characteristics.map((characteristic) => ({
      name: characteristic.name,
      value: characteristic.value
    })) ?? [])
  ].slice(0, MAX_VISIBLE_ROWS);

  if (!rows.length) return null;

  return (
    <section className='min-w-0 space-y-1.5'>
      {rows.map((row) => (
        <p key={`${row.name}-${row.value}`} className='text-sm leading-6'>
          <span className='text-muted-foreground'>{row.name}: </span>
          <span className='font-medium'>{row.value}</span>
        </p>
      ))}
      <Button
        className='text-primary h-auto gap-1 px-0 text-sm font-medium'
        type='button'
        variant='link'
        onClick={onShowAll}
      >
        {t`Show all characteristics`}
        <ChevronRightIcon className='size-4' />
      </Button>
    </section>
  );
};
