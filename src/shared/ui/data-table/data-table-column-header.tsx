import type { Column } from '@tanstack/react-table';

import { useLingui } from '@lingui/react/macro';
import { ChevronDown, ChevronsUpDown, ChevronUp, EyeOff, X } from 'lucide-react';

import { cn } from '@/shared/lib/utils.ts';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu.tsx';

interface DataTableColumnHeaderProps<TData, TValue> extends React.ComponentProps<
  typeof DropdownMenuTrigger
> {
  column: Column<TData, TValue>;
  title: string;
}

export const DataTableColumnHeader = <TData, TValue>({
  column,
  title,
  className,
  ...props
}: DataTableColumnHeaderProps<TData, TValue>) => {
  const { t } = useLingui();
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          'hover:bg-accent focus:ring-ring data-[state=open]:bg-accent [&_svg]:text-muted-foreground -ml-1.5 flex h-8 items-center gap-1.5 rounded-md px-2 py-1.5 focus:ring-1 focus:outline-none [&_svg]:size-4 [&_svg]:shrink-0',
          className
        )}
        {...props}
      >
        {title}
        {column.getCanSort() &&
          (column.getIsSorted() === 'desc' ? (
            <ChevronDown />
          ) : column.getIsSorted() === 'asc' ? (
            <ChevronUp />
          ) : (
            <ChevronsUpDown />
          ))}
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-28'>
        {column.getCanSort() && (
          <>
            <DropdownMenuCheckboxItem
              checked={column.getIsSorted() === 'asc'}
              className='[&_svg]:text-muted-foreground relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto'
              onClick={() => column.toggleSorting(false)}
            >
              <ChevronUp />
              {t`Asc`}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={column.getIsSorted() === 'desc'}
              className='[&_svg]:text-muted-foreground relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto'
              onClick={() => column.toggleSorting(true)}
            >
              <ChevronDown />
              {t`Desc`}
            </DropdownMenuCheckboxItem>
            {column.getIsSorted() && (
              <DropdownMenuItem
                className='[&_svg]:text-muted-foreground pl-2'
                onClick={() => column.clearSorting()}
              >
                <X />
                {t`Reset`}
              </DropdownMenuItem>
            )}
          </>
        )}
        {column.getCanHide() && (
          <DropdownMenuCheckboxItem
            checked={!column.getIsVisible()}
            className='[&_svg]:text-muted-foreground relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto'
            onClick={() => column.toggleVisibility(false)}
          >
            <EyeOff />
            {t`Hide`}
          </DropdownMenuCheckboxItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
