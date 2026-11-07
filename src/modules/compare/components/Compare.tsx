import { useLingui } from '@lingui/react/macro';
import { useQueries } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { ScaleIcon, XIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { CartButtons } from '@/modules/cart/components/CartButtons';
import { getPublicProductByIdQueryOptions } from '@/modules/products';
import { CURRENCY_SYMBOL, generateSlugId } from '@/shared/constants';
import { formatPrice } from '@/shared/lib/format';
import { useCompareStore } from '@/shared/store';
import { Button } from '@/shared/ui/button';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/shared/ui/empty';
import { Label } from '@/shared/ui/label';
import { Skeleton } from '@/shared/ui/skeleton';
import { Switch } from '@/shared/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';

// Attributes and free-form characteristics are compared the same way, by their name.
const getSpecs = (product: PublicProduct) => {
  const specs = new Map<string, string>();

  [
    ...product.attributes.map(({ name, value }) => ({ name, value: value.value })),
    ...product.characteristics
  ].forEach(({ name, value }) => {
    const current = specs.get(name);
    specs.set(name, current ? `${current}, ${value}` : value);
  });

  return specs;
};

export const Compare = () => {
  const { t } = useLingui();
  const { clear, isHydrated, items, remove } = useCompareStore();
  const [onlyDifferences, setOnlyDifferences] = useState(false);
  const [activeCategory, setActiveCategory] = useState<number>();

  const results = useQueries({
    queries: items.map(({ id }) => getPublicProductByIdQueryOptions({ id }))
  });

  // A product deleted from the catalog leaves the list on its own.
  useEffect(() => {
    results.forEach(({ error }, index) => {
      if (isAxiosError(error) && error.response?.status === 404) remove(items[index].id);
    });
  });

  if (!isHydrated || results.some(({ isPending }) => isPending))
    return <Skeleton className='h-96 w-full rounded-lg' />;

  const products = results.flatMap(({ data }) => (data ? [data] : []));

  if (!products.length)
    return (
      <Empty className='w-full'>
        <EmptyHeader>
          <EmptyMedia variant='icon'>
            <ScaleIcon />
          </EmptyMedia>
          <EmptyTitle>{t`Nothing to compare yet.`}</EmptyTitle>
          <EmptyDescription>{t`Click the ⚖ icon on products to compare their characteristics.`}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );

  const categories = Array.from(
    new Map(products.map(({ category }) => [category.id, category.name]))
  );
  const categoryId = categories.some(([id]) => id === activeCategory)
    ? activeCategory
    : categories[0][0];
  const list = products.filter(({ category }) => category.id === categoryId);

  const specs = list.map(getSpecs);
  const rows = Array.from(new Set(specs.flatMap((spec) => Array.from(spec.keys()))))
    .map((name) => {
      const values = specs.map((spec) => spec.get(name) ?? '—');
      return { name, values, isDifferent: new Set(values).size > 1 };
    })
    .filter((row) => !onlyDifferences || row.isDifferent);

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center gap-x-6 gap-y-3'>
        {categories.length > 1 && (
          <Tabs
            value={String(categoryId)}
            onValueChange={(value) => setActiveCategory(Number(value))}
          >
            <TabsList>
              {categories.map(([id, name]) => (
                <TabsTrigger key={id} value={String(id)}>
                  {name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        )}
        <div className='flex items-center gap-2'>
          <Switch
            checked={onlyDifferences}
            id='only-differences'
            onCheckedChange={setOnlyDifferences}
          />
          <Label htmlFor='only-differences'>{t`Only differences`}</Label>
        </div>
        <Button
          className='ml-auto'
          variant='outline'
          onClick={() => categoryId !== undefined && clear(categoryId)}
        >
          {t`Clear list`}
        </Button>
      </div>

      <div className='rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow className='bg-background hover:bg-background'>
              <TableHead className='sticky left-0 z-10 w-36 min-w-36 bg-inherit' />
              {list.map((product) => {
                const slug = generateSlugId(product.id, product.name);

                return (
                  <TableHead
                    key={product.id}
                    className='h-auto min-w-60 p-3 align-top whitespace-normal'
                  >
                    <div className='relative space-y-2'>
                      <Button
                        aria-label={t`Remove from comparison`}
                        className='absolute top-0 right-0 size-7'
                        size='icon'
                        variant='ghost'
                        onClick={() => remove(product.id)}
                      >
                        <XIcon />
                      </Button>
                      <Link params={{ slug }} to='/product/$slug'>
                        {product.image && (
                          <img
                            alt={product.name}
                            className='size-28 rounded-lg border object-cover'
                            src={product.image}
                          />
                        )}
                      </Link>
                      <Link
                        className='line-clamp-2 font-semibold hover:underline'
                        params={{ slug }}
                        to='/product/$slug'
                      >
                        {product.name}
                      </Link>
                      <p className='text-lg font-extrabold'>
                        {formatPrice(product.final_price)} {t(CURRENCY_SYMBOL)}
                      </p>
                      <CartButtons product={product} />
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell
                  className='text-muted-foreground py-6 text-center'
                  colSpan={list.length + 1}
                >
                  {t`All characteristics are the same.`}
                </TableCell>
              </TableRow>
            )}
            {rows.map(({ name, values, isDifferent }) => (
              <TableRow
                key={name}
                className={isDifferent ? 'bg-yellow-50 hover:bg-yellow-50' : 'bg-background'}
              >
                <TableCell className='text-muted-foreground sticky left-0 z-10 bg-inherit whitespace-normal'>
                  {name}
                </TableCell>
                {values.map((value, index) => (
                  <TableCell key={list[index].id} className='font-medium whitespace-normal'>
                    {value}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
