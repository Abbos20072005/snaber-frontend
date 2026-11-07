import { useLingui } from '@lingui/react/macro';
import { ChevronRightIcon } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

import { CategoryHeading } from './CategoryHeading';

interface CategorySidebarProps {
  roots: Category[];
  selectedId?: number;
  onSelect: (id: number) => void;
}

export const CategorySidebar = ({ roots, selectedId, onSelect }: CategorySidebarProps) => {
  const { t } = useLingui();

  return (
    <aside className='max-w-full shrink-0 self-start md:sticky md:top-29 md:max-h-[calc(100vh-7.25rem)] md:w-55 md:overflow-y-auto md:[scrollbar-width:none] md:[&::-webkit-scrollbar]:hidden'>
      <CategoryHeading title={t`Choose a category`} />
      <ul className='mt-1 flex gap-2 overflow-x-auto py-1 md:flex-col md:gap-0 md:overflow-visible md:border-b'>
        {roots.map((root) => (
          <li key={root.id} className='shrink-0 md:first:[&>button]:border-t-0'>
            <button
              className={cn(
                'flex w-full items-center justify-between gap-2 rounded-full border px-3 py-1.5 text-left text-sm leading-snug whitespace-nowrap transition-colors md:rounded-none md:border-0 md:border-t md:px-2 md:py-2 md:whitespace-normal',
                root.id === selectedId
                  ? 'bg-yellow-400 font-semibold text-black'
                  : 'text-foreground/80 hover:bg-yellow-400/20 hover:text-black'
              )}
              type='button'
              onClick={() => onSelect(root.id)}
            >
              <span className='min-w-0 flex-1'>{root.name}</span>
              <ChevronRightIcon
                className={cn(
                  'hidden size-4 shrink-0 md:block',
                  root.id === selectedId ? 'text-black' : 'text-muted-foreground'
                )}
              />
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};
