import { cn } from '@/shared/lib/utils';

interface Props {
  className?: string;
  title: string;
}

// Shared heading for the catalog columns — a fixed height keeps the underline of the
// sidebar and the category list on the same level.
export const CategoryHeading = ({ className, title }: Props) => (
  <div
    className={cn(
      'border-b-2 flex h-9 items-end border-yellow-400 pb-1.5',
      className
    )}
  >
    <h2 className='text-foreground truncate text-base font-bold md:text-lg'>{title}</h2>
  </div>
);
