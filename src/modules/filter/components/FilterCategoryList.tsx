import { useLingui } from '@lingui/react/macro';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronDownIcon, ChevronRightIcon, ImageIcon } from 'lucide-react';
import { parseAsInteger as parseAsInt, useQueryState } from 'nuqs';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { getPublicAllCategoriesOptions, getPublicCategoryByIdOptions } from '@/modules/category';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Collapsible, CollapsibleContent } from '@/shared/ui/collapsible';
import { Skeleton } from '@/shared/ui/skeleton';

import { FilterItemLabel } from './FilterItemLabel';

interface Props {
  category?: number | string;
  resetRef?: React.RefObject<(() => void) | null>;
}

interface ExpandedCategory {
  categoryId: number;
  depth: number;
}

export const FilterCategoryList = ({ resetRef, category }: Props) => {
  const { t } = useLingui();
  const queryClient = useQueryClient();
  const defaultCategory = Number(category);
  const defaultCategoryId = Number.isFinite(defaultCategory) ? defaultCategory : undefined;

  const [categoryId, setCategoryId] = useQueryState(
    'category',
    defaultCategoryId
      ? parseAsInt.withOptions({ history: 'replace' }).withDefault(defaultCategoryId)
      : parseAsInt.withOptions({ history: 'replace' })
  );

  const [expandedIds, setExpandedIds] = useState<ExpandedCategory[]>(() => []);

  useEffect(() => {
    if (resetRef) resetRef.current = () => setExpandedIds([]);
  }, [resetRef]);

  const allCategoriesQuery = useQuery(getPublicAllCategoriesOptions());
  // FEATURE DISABLED: Group level (level 0) is not shown in the storefront.
  // Only main categories (sections) are listed, like on the main page.
  const allCategories: Category[] = useMemo(
    () => (allCategoriesQuery.data ?? []).flatMap((group) => group.children ?? []),
    [allCategoriesQuery.data]
  );
  const expandedCategoryIds = useMemo(
    () => new Set(expandedIds.map((item) => item.categoryId)),
    [expandedIds]
  );

  const isExistsInExpanded = useCallback(
    (id: number) => {
      return expandedCategoryIds.has(id);
    },
    [expandedCategoryIds]
  );

  const expandedCategoryQueryOptions = useMemo(
    () => expandedIds.map((id) => getPublicCategoryByIdOptions({ id: id.categoryId })),
    [expandedIds]
  );

  const expandedCategoryQueries = useQueries({
    queries: expandedCategoryQueryOptions
  });

  const expandedCategoriesMap = expandedIds.reduce<Record<number, Category>>((acc, id, index) => {
    const data = expandedCategoryQueries[index]?.data;
    if (data) acc[id.categoryId] = data;
    return acc;
  }, {});

  const toggleExpand = useCallback((id: number, depth: number) => {
    setExpandedIds((prev) => {
      const isExpanded = prev.some((item) => item.categoryId === id);
      const nextItems = prev.filter((item) => {
        if (item.categoryId === id) return false;

        return isExpanded ? item.depth <= depth : item.depth < depth;
      });

      if (!isExpanded) {
        nextItems.push({
          categoryId: id,
          depth
        });
      }

      return nextItems;
    });
  }, []);

  const prefetchChildren = useCallback(
    (id: number) => {
      void queryClient.ensureQueryData(getPublicCategoryByIdOptions({ id }));
    },
    [queryClient]
  );

  const renderCategory = (cat: Category, depth = 0) => {
    const isExpanded = isExistsInExpanded(cat.id);
    const isSelected = categoryId === cat.id;
    const hasChildren = !cat.is_leaf;
    const categoryByIdOptions = getPublicCategoryByIdOptions({ id: cat.id });
    const cachedExpandedData = queryClient.getQueryData<Category>(categoryByIdOptions.queryKey);
    const expandedData = expandedCategoriesMap[cat.id] ?? cachedExpandedData;
    const children = expandedData?.children ?? cat.children ?? [];
    const isLoadingChildren = isExpanded && !expandedData && !(cat.children ?? []).length;

    return (
      <Collapsible key={cat.id} open={isExpanded}>
        <Button
          className={cn('h-auto w-full justify-start py-1.5 whitespace-normal hover:bg-transparent')}
          variant='ghost'
          onClick={() => {
            void setCategoryId(cat.id);
            if (hasChildren) toggleExpand(cat.id, depth);
          }}
          onFocus={() => {
            if (hasChildren) prefetchChildren(cat.id);
          }}
          onMouseEnter={() => {
            if (hasChildren) prefetchChildren(cat.id);
          }}
        >
          <div
            className={cn(
              'flex w-full items-center gap-1.5 rounded-sm px-1 py-0.5 transition-colors',
              depth > 0 && 'ml-3',
              isSelected
                ? 'bg-yellow-400 font-semibold text-black'
                : 'group-hover/button:bg-yellow-400/20'
            )}
          >
            {cat.image ? (
              <img alt={cat.name} className='size-6 shrink-0 rounded-xs border object-cover' src={cat.image} />
            ) : (
              <span className='bg-muted/60 flex size-6 shrink-0 items-center justify-center rounded-xs border'>
                <ImageIcon className='text-muted-foreground/60 size-3.5' />
              </span>
            )}
            <span className='min-w-0 flex-1 text-left break-words'>{cat.name}</span>
            {hasChildren &&
              (isExpanded ? (
                <ChevronDownIcon className='size-4 shrink-0' />
              ) : (
                <ChevronRightIcon className='size-4 shrink-0' />
              ))}
          </div>
        </Button>

        {hasChildren && (
          <CollapsibleContent className='duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] data-ending-style:opacity-0 data-starting-style:opacity-0'>
            {isLoadingChildren ? (
              <div className='ml-3 space-y-2 pb-1 pt-1'>
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className='h-5 w-full' />
                ))}
              </div>
            ) : (
              <div className='ml-2 pb-1 pt-1'>
                {children.map((child) => renderCategory(child, depth + 1))}
              </div>
            )}
          </CollapsibleContent>
        )}
      </Collapsible>
    );
  };

  return (
    <div className='space-y-3'>
      <FilterItemLabel label={t`Categories`} />

      <div className='min-h-10 space-y-1'>
        {allCategoriesQuery.isPending ? (
          <div className='space-y-2'>
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className='h-5 w-full' />
            ))}
          </div>
        ) : (
          allCategories.map((cat) => renderCategory(cat))
        )}
      </div>
    </div>
  );
};
