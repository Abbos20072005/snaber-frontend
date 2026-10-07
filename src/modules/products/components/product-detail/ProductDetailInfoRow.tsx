import type { ReactNode } from 'react';

interface ProductDetailInfoRowProps {
  label: string;
  value: ReactNode;
}

export const ProductDetailInfoRow = ({ label, value }: ProductDetailInfoRowProps) => {
  return (
    <div className='flex items-center justify-between gap-1 sm:justify-start'>
      <span className='text-muted-foreground text-xs'>{label}:</span>
      <span className='text-right text-sm font-medium'>{value}</span>
    </div>
  );
};
