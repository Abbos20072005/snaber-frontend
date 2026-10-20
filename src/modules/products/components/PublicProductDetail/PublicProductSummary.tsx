import { useLingui } from '@lingui/react/macro';
import { ArrowDownIcon, CheckIcon, CopyIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/shared/ui/button.tsx';

const MAX_VISIBLE_ROWS = 6;

interface PublicProductSummaryProps {
  product: PublicProduct;
  onShowAll: () => void;
}

export const PublicProductSummary = ({ product, onShowAll }: PublicProductSummaryProps) => {
  const { t } = useLingui();
  const [isCopied, setIsCopied] = useState(false);

  const rows = [
    ...product.attributes.map((attribute) => ({
      name: attribute.name,
      value: attribute.value.value
    })),
    ...product.characteristics.map(({ name, value }) => ({ name, value }))
  ];
  const visibleRows = rows.slice(0, MAX_VISIBLE_ROWS);

  const copySku = () => {
    void navigator.clipboard.writeText(product.sku).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    });
  };

  return (
    <section className='min-w-0 space-y-5'>
      <h1 className='text-2xl leading-tight font-bold lg:text-3xl'>{product.name}</h1>

      {product.sku && (
        <div className='text-muted-foreground flex items-center gap-2 text-sm'>
          <span>{t`Code`}:</span>
          <span className='text-foreground font-medium'>{product.sku}</span>
          <button
            aria-label={t`Copy code`}
            className='hover:text-foreground transition-colors'
            type='button'
            onClick={copySku}
          >
            {isCopied ? <CheckIcon className='size-4' /> : <CopyIcon className='size-4' />}
          </button>
        </div>
      )}

      {visibleRows.length > 0 && (
        <div className='border-t pt-5'>
          <h2 className='mb-2 text-lg font-semibold'>{t`Main characteristics`}</h2>
          <dl>
            {visibleRows.map((row) => (
              <div
                key={`${row.name}-${row.value}`}
                className='grid grid-cols-2 gap-4 border-b py-3 text-sm last:border-b-0'
              >
                <dt className='text-muted-foreground'>{row.name}</dt>
                <dd className='font-medium'>{row.value}</dd>
              </div>
            ))}
          </dl>
          <Button
            className='text-primary h-auto gap-1 px-0 text-sm font-medium'
            type='button'
            variant='link'
            onClick={onShowAll}
          >
            {t`All characteristics`}
            <ArrowDownIcon className='size-4' />
          </Button>
        </div>
      )}
    </section>
  );
};
