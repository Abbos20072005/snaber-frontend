import type { ReactNode } from 'react';

import { useLingui } from '@lingui/react/macro';
import { ImageIcon } from 'lucide-react';

import {
  priceTypeColorMap,
  priceTypeLabelMap,
  productTypeColorMap,
  productTypeLabelMap
} from '@/modules/products';
import { formatPrice } from '@/shared/lib/format';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';

import { ProductDetailMetricCard } from './ProductDetailMetricCard';

interface Props {
  formattedPrice: ReactNode;
  leadTime: string;
  product: Product;
  totalStock: number;
}

export const ProductDetailHero = ({ product, formattedPrice, leadTime, totalStock }: Props) => {
  const { t } = useLingui();
  const productTypeColor = productTypeColorMap[product.product_type];
  const priceTypeColor = priceTypeColorMap[product.price_type];

  return (
    <Card className='p-0'>
      <CardContent className='from-primary/8 to-background grid bg-linear-to-r p-0 md:grid-cols-[220px_1fr]'>
        <div className='border-border/70 bg-muted/30 border-b p-4 md:border-r md:border-b-0'>
          {product.image ? (
            <img
              alt={product.name}
              className='aspect-square h-full max-h-60 w-full rounded-lg border object-cover'
              src={product.image || ''}
            />
          ) : (
            <ImageIcon className='text-muted-foreground aspect-square h-full max-h-60 w-full rounded-lg border object-cover' />
          )}
        </div>
        <div className='space-y-4 p-4'>
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <div className='space-y-1'>
              <p className='font-heading text-2xl leading-tight font-semibold'>{product.name}</p>
              <div className='text-muted-foreground flex flex-wrap items-center gap-2 text-xs'>
                <span>{t`SKU:`} {product.sku}</span>
                <span className='bg-border size-1 rounded-full' />
                <span>ID: {product.product_id}</span>
              </div>
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              <Badge variant={product.is_active ? 'success' : 'outline'}>
                {product.is_active ? t`Active` : t`Inactive`}
              </Badge>
              <Badge
                style={{
                  color: productTypeColor,
                  backgroundColor: `${productTypeColor}20`
                }}
              >
                {t(productTypeLabelMap[product.product_type])}
              </Badge>
              <Badge
                style={{
                  color: priceTypeColor,
                  backgroundColor: `${priceTypeColor}20`
                }}
              >
                {t(priceTypeLabelMap[product.price_type])}
              </Badge>
            </div>
          </div>
          <div className='grid gap-2 sm:grid-cols-2 lg:grid-cols-4'>
            <ProductDetailMetricCard label={t`Price`} value={formattedPrice} />
            <ProductDetailMetricCard label='MOQ' value={`${formatPrice(product.moq)}`} />
            <ProductDetailMetricCard label={t`Lead time`} value={leadTime} />
            <ProductDetailMetricCard label={t`Stock`} value={formatPrice(totalStock)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
