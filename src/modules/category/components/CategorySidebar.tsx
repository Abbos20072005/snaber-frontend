import { useLingui } from '@lingui/react/macro';

import { cn } from '@/shared/lib/utils';

interface CategorySidebarProps {
  roots: Category[];
  selectedId?: number;
  onSelect: (id: number) => void;
}

export const CategorySidebar = ({ roots, selectedId, onSelect }: CategorySidebarProps) => {
  const { t } = useLingui();

  return (
    <aside className='shrink-0 self-start md:sticky md:top-19 md:max-h-[calc(100vh-6rem)] md:w-55 md:overflow-y-auto'>
      <p className='border-b pb-2 text-[15px] font-semibold'>{t`Choose a category`}</p>
      <ul className='mt-1 flex gap-1 overflow-x-auto py-1 md:flex-col md:overflow-visible'>
        {roots.map((root) => (
          <li key={root.id} className='shrink-0'>
            <button
              className={cn(
                'w-full rounded-sm px-2 py-1.5 text-left text-sm whitespace-nowrap transition-colors md:whitespace-normal',
                root.id === selectedId
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-foreground/80 hover:bg-muted'
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
