import type { ReactNode } from 'react';

interface PublicProductDetailRowProps {
  label: string;
  value: ReactNode;
}

export const PublicProductDetailRow = ({ label, value }: PublicProductDetailRowProps) => (
  <div className='flex justify-between gap-4 border-b py-3'>
    <dt className='text-muted-foreground text-sm font-medium'>{label}</dt>
    <dd className='text-right text-sm font-semibold'>{value}</dd>
  </div>
);
