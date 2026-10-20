import { useLingui } from '@lingui/react/macro';
import { useQueries, useQuery } from '@tanstack/react-query';
import { ChevronRightIcon, XIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import {
  getCategoryBreadcrumbByIdOptions,
  getPublicAllCategoriesOptions,
  getPublicCategoryByIdOptions
} from '@/modules/category';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';

interface CategoryOption {
  label: string;
  value: string;
}

interface Props {
  disabled?: boolean;
  value: CategoryOption | null;
  onValueChange?: (value: CategoryOption | null) => void;
}

interface CategorySelectLevel {
  disabled?: boolean;
  options: CategoryOption[];
  placeholder: string;
  selectedLabel?: string;
  value: string;
  onChange: (categoryId: string) => void;
}

const EMPTY_OPTION: CategoryOption = {
  label: '',
  value: ''
};

const toCategoryOption = (category: Breadcrumb | Category): CategoryOption => ({
  label: category.name,
  value: String(category.id)
});

const CategoryLevelSelect = ({
  disabled,
  options,
  placeholder,
  selectedLabel,
  value,
  onChange
}: CategorySelectLevel) => (
  <Select
    disabled={disabled || !options.length}
    value={value}
    onValueChange={(id) => onChange(id ?? '')}
  >
    <SelectTrigger className='w-full'>
      <SelectValue placeholder={placeholder}>{selectedLabel}</SelectValue>
    </SelectTrigger>
    <SelectContent className='w-auto max-w-[min(26rem,90vw)] min-w-(--anchor-width)'>
      <SelectGroup>
        {options.map((category) => (
          <SelectItem key={category.value} value={category.value}>
            {category.label}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);

export const CategoryNestedSelect = ({ disabled, value, onValueChange }: Props) => {
  const { t } = useLingui();
  const [selectedPath, setSelectedPath] = useState<CategoryOption[]>([]);

  const rootCategoriesQuery = useQuery(getPublicAllCategoriesOptions());
  const breadcrumbQuery = useQuery({
    ...getCategoryBreadcrumbByIdOptions({ id: value?.value ?? '' }),
    enabled: !!value?.value
  });

  const breadcrumbPath = useMemo(
    () => (breadcrumbQuery.data ?? []).map(toCategoryOption),
    [breadcrumbQuery.data]
  );
  const shouldUseSelectedPath = selectedPath.at(-1)?.value === value?.value;
  const visiblePath = value?.value ? (shouldUseSelectedPath ? selectedPath : breadcrumbPath) : [];

  const categoryPathQueries = useQueries({
    queries: visiblePath.map((category) => ({
      ...getPublicCategoryByIdOptions({ id: category.value }),
      enabled: !!category.value
    }))
  });

  const rootOptions = useMemo(
    () => (rootCategoriesQuery.data ?? []).map(toCategoryOption),
    [rootCategoriesQuery.data]
  );

  const levelOptions = [
    rootOptions,
    ...categoryPathQueries
      .slice(0, -1)
      .map((query) => (query.data?.children ?? []).map(toCategoryOption))
  ];

  const currentCategoryQuery = categoryPathQueries.at(-1);
  const nextLevelOptions = (currentCategoryQuery?.data?.children ?? []).map(toCategoryOption);

  const isRootLoading = rootCategoriesQuery.isPending;
  const shouldShowNextLevel =
    !!visiblePath.length && (currentCategoryQuery?.isPending || nextLevelOptions.length > 0);

  const getPlaceholder = (index: number) =>
    index === 0 ? t`Select category` : t`Select subcategory`;

  const handleValueChange = (levelIndex: number, categoryId: string) => {
    const options = levelOptions[levelIndex] ?? nextLevelOptions;
    const selectedCategory = options.find((category) => category.value === categoryId);
    if (!selectedCategory) return;

    const nextPath = [...visiblePath.slice(0, levelIndex), selectedCategory];

    setSelectedPath(nextPath);
    onValueChange?.(selectedCategory);
  };

  const handleClear = () => {
    setSelectedPath([]);
    onValueChange?.(EMPTY_OPTION);
  };

  const selectLevels: CategorySelectLevel[] = [
    ...levelOptions.map<CategorySelectLevel>((options, index) => ({
      disabled: disabled || isRootLoading,
      options,
      placeholder: getPlaceholder(index),
      selectedLabel: visiblePath[index]?.label,
      value: visiblePath[index]?.value ?? '',
      onChange: (categoryId) => handleValueChange(index, categoryId)
    })),
    ...(shouldShowNextLevel
      ? [
          {
            disabled: disabled || currentCategoryQuery?.isPending,
            options: nextLevelOptions,
            placeholder: t`Select subcategory`,
            value: '',
            onChange: (categoryId: string) => handleValueChange(visiblePath.length, categoryId)
          }
        ]
      : [])
  ];

  return (
    <div className='bg-muted/20 rounded-md border p-3'>
      <div className='flex items-start justify-between gap-3'>
        {visiblePath.length ? (
          <div className='flex flex-wrap items-center gap-1.5'>
            {visiblePath.map((category, index) => (
              <div key={category.value} className='flex min-w-0 items-center gap-1.5'>
                {index > 0 && <ChevronRightIcon className='text-muted-foreground size-3' />}
                <Badge className='max-w-48 justify-start truncate' variant='secondary'>
                  <span className='truncate'>{category.label}</span>
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-muted-foreground text-sm'>{t`No category selected`}</p>
        )}

        {visiblePath.length > 0 && (
          <Button
            aria-label={t`Clear category`}
            className='size-8 shrink-0'
            disabled={disabled}
            size='icon'
            type='button'
            variant='ghost'
            onClick={handleClear}
          >
            <XIcon />
          </Button>
        )}
      </div>

      <div className='grid gap-2 sm:grid-cols-2 xl:grid-cols-4'>
        {selectLevels.map((level, index) => (
          <CategoryLevelSelect key={`category-level-${index}`} {...level} />
        ))}
      </div>
    </div>
  );
};
