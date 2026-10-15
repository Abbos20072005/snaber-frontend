import { useLingui } from '@lingui/react/macro';
import { ImageIcon } from 'lucide-react';

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
                'w-full rounded-sm px-2 py-1.5 text-left text-sm whitespace-nowrap transition-colors hover:bg-transparent md:whitespace-normal',
                root.id === selectedId
                  ? 'bg-yellow-400 font-semibold text-black hover:bg-yellow-400'
                  : 'text-foreground/80 hover:bg-yellow-400/20 hover:text-black'
              )}
              type='button'
              onClick={() => onSelect(root.id)}
            >
              {root.image ? (
                <img
                  alt={root.name}
                  className='size-8 shrink-0 rounded-md border object-cover'
                  loading='lazy'
                  src={root.image}
                />
              ) : (
                <span className='bg-muted/60 flex size-8 shrink-0 items-center justify-center rounded-md border'>
                  <ImageIcon className='text-muted-foreground/60 size-4' />
                </span>
              )}
              <span className='min-w-0 flex-1 break-words'>{root.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};
