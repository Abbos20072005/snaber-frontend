import type { ReactNode } from 'react';

interface PublicProductKeyValueItem {
  name: string;
  value: ReactNode;
}

interface PublicProductKeyValueListProps {
  emptyText: string;
  items: PublicProductKeyValueItem[];
}

export const PublicProductKeyValueList = ({ emptyText, items }: PublicProductKeyValueListProps) => {
  if (!items.length) return <p className='text-muted-foreground text-sm'>{emptyText}</p>;

  return (
    <dl className='grid gap-2 sm:grid-cols-2'>
      {items.map((item) => (
        <div key={`${item.name}-${String(item.value)}`} className='rounded-lg border p-3'>
          <dt className='text-muted-foreground text-xs font-medium'>{item.name}</dt>
          <dd className='mt-1 text-sm font-semibold'>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
};
