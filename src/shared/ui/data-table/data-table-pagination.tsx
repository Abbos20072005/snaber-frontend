import type { Table } from '@tanstack/react-table';

import { useLingui } from '@lingui/react/macro';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/shared/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

interface TablePaginationProps<TData> extends React.ComponentProps<'div'> {
  pageSizeOptions?: number[];
  table: Table<TData>;
}

export const DataTablePagination = <TData,>({
  table,
  pageSizeOptions = [10, 20, 30, 40, 50],
  className,
  ...props
}: TablePaginationProps<TData>) => {
  const { t } = useLingui();
  const pagination = table.getState().pagination;
  const pageCount = table.getPageCount();
  const currentPage = pagination.pageIndex + 1; // Convert from 0-based to 1-based

  const handlePageChange = React.useCallback(
    (newPage: number) => {
      // Convert from 1-based to 0-based index
      const pageIndex = newPage - 1;
      if (pageIndex >= 0 && pageIndex < pageCount) {
        table.setPageIndex(pageIndex);
      }
    },
    [table, pageCount]
  );

  const getPageNumbers = React.useCallback(() => {
    const pages: (number | 'ellipsis')[] = [];
    const maxVisible = 7; // Maximum number of page buttons to show

    if (pageCount <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 4) {
        // Show pages 1-5, then ellipsis, then last page
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(pageCount);
      } else if (currentPage >= pageCount - 3) {
        // Show first page, ellipsis, then last 5 pages
        pages.push('ellipsis');
        for (let i = pageCount - 4; i <= pageCount; i++) {
          pages.push(i);
        }
      } else {
        // Show first page, ellipsis, current-1, current, current+1, ellipsis, last page
        pages.push('ellipsis');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('ellipsis');
        pages.push(pageCount);
      }
    }

    return pages;
  }, [currentPage, pageCount]);

  const pageNumbers = getPageNumbers();

  if (pageCount <= 0) return null;

  return (
    <div className={cn('flex w-full items-center justify-between gap-4', className)} {...props}>
      {/* Left side: Show items per page */}
      <div className='flex items-center gap-2'>
        <span className='text-muted-foreground text-sm'>{t`Number of rows:`}</span>
        <Select
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={(value) => {
            table.setPageSize(Number(value));
          }}
        >
          <SelectTrigger className='w-20' size='sm'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={`${size}`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Pagination className='mx-0 w-auto'>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={cn(!table.getCanPreviousPage() && 'pointer-events-none opacity-50')}
              disabled={!table.getCanPreviousPage()}
              onClick={() => {
                if (table.getCanPreviousPage()) {
                  table.previousPage();
                }
              }}
            />
          </PaginationItem>

          {pageNumbers.map((pageNum, index) => {
            if (pageNum === 'ellipsis') {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            const isActive = pageNum === currentPage;

            return (
              <PaginationItem key={pageNum}>
                <PaginationLink
                  className={cn(
                    'min-w-8',
                    isActive && 'bg-primary text-primary-foreground hover:bg-primary/90'
                  )}
                  isActive={isActive}
                  onClick={() => {
                    handlePageChange(pageNum);
                  }}
                >
                  {pageNum}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              className={cn(!table.getCanNextPage() && 'pointer-events-none opacity-50')}
              disabled={!table.getCanNextPage()}
              onClick={() => {
                if (table.getCanNextPage()) {
                  table.nextPage();
                }
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
