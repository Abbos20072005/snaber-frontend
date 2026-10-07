import { cn } from '@/shared/lib/utils';

type ValueSize = 'base' | 'lg' | 'sm';

export type InfoFieldProp = React.ComponentProps<'div'> & {
  value?: number | string;
  label: string;
  size?: ValueSize;
  children?: React.ReactNode;
};

export const InfoField = ({
  className,
  children,
  value,
  label,
  size = 'sm',
  ...props
}: InfoFieldProp) => {
  return (
    <div className={cn('flex flex-col gap-1', className)} {...props}>
      <label className='text-muted-foreground text-sm font-medium'>{label}:</label>
      {children ?? (
        <p
          className={cn({
            'text-lg font-semibold': size === 'lg',
            'text-base font-medium': size === 'base',
            'text-sm font-normal': size === 'sm'
          })}
        >
          {value}
        </p>
      )}
    </div>
  );
};
