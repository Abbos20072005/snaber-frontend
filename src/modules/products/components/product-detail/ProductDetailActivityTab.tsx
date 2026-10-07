import { useLingui } from '@lingui/react/macro';

import { formatLocaleDate } from '@/shared/lib/format';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { Separator } from '@/shared/ui/separator';

import { ProductDetailInfoRow } from './ProductDetailInfoRow';
import { ProductDetailMetricCard } from './ProductDetailMetricCard';

interface Props {
  mediaCount: number;
  product: Product;
}

export const ProductDetailActivityTab = ({ product, mediaCount }: Props) => {
  const { t } = useLingui();

  return (
    <Card>
      <CardHeader className='border-b'>
        <CardTitle>{t`Record timeline`}</CardTitle>
        <CardDescription>{t`Lifecycle events for this product record.`}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-3'>
          <ProductDetailInfoRow
            label={t`Created at`}
            value={formatLocaleDate(product.created_at, 'PPp')}
          />
          <ProductDetailInfoRow
            label={t`Last updated`}
            value={formatLocaleDate(product.updated_at, 'PPp')}
          />
        </div>
        <Separator />
        <div className='grid gap-2 sm:grid-cols-2'>
          <ProductDetailMetricCard label={t`Category`} value={product.category.name} />
          <ProductDetailMetricCard label={t`Main media`} value={mediaCount} />
        </div>
      </CardContent>
    </Card>
  );
};
