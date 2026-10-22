import { useLingui } from '@lingui/react/macro';

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
    <aside className='shrink-0 self-start md:sticky md:top-29 md:max-h-[calc(100vh-7.25rem)] md:w-55 md:overflow-y-auto'>
      <CategoryHeading title={t`Choose a category`} />
      <ul className='mt-1 flex gap-1 overflow-x-auto py-1 md:flex-col md:gap-0 md:overflow-visible'>
        {roots.map((root) => (
          <li key={root.id} className='shrink-0'>
            <button
              className={cn(
                'w-full rounded-sm px-2 py-1 text-left text-sm leading-snug whitespace-nowrap transition-colors md:whitespace-normal',
                root.id === selectedId
                  ? 'bg-yellow-400 font-semibold text-black'
                  : 'text-foreground/80 hover:bg-yellow-400/20 hover:text-black'
              )}
              type='button'
              onClick={() => onSelect(root.id)}
            >
              {root.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};
