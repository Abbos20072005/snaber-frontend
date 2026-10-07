import type { ReactNode } from 'react';

import { useLingui } from '@lingui/react/macro';

import { priceTypeLabelMap, productTypeLabelMap } from '@/modules/products';
import { formatPrice } from '@/shared/lib/format';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';

import { ProductDetailInfoRow } from './ProductDetailInfoRow';

interface Props {
  formattedPrice: ReactNode;
  leadTime: string;
  product: Product;
}

export const ProductDetailOverviewTab = ({ product, formattedPrice, leadTime }: Props) => {
  const { t } = useLingui();

  return (
    <div className='grid gap-4 lg:grid-cols-2'>
      <Card>
        <CardHeader className='border-b'>
          <CardTitle>{t`General information`}</CardTitle>
          <CardDescription>{t`Primary product identity and classification.`}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          <ProductDetailInfoRow label={t`Product ID`} value={product.product_id} />
          <ProductDetailInfoRow label={t`Name`} value={product.name} />
          <ProductDetailInfoRow label='SKU' value={product.sku} />
          <ProductDetailInfoRow label={t`Category`} value={product.category.name} />
          <ProductDetailInfoRow
            label={t`Status`}
            value={product.is_active ? t`Active` : t`Inactive`}
          />
          <ProductDetailInfoRow
            label={t`Industries`}
            value={product.industries.map((industry) => industry.name).join(', ') || '-'}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className='border-b'>
          <CardTitle>{t`Commercial terms`}</CardTitle>
          <CardDescription>{t`Pricing and fulfillment baseline terms.`}</CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          <ProductDetailInfoRow
            label={t`Price model`}
            value={t(priceTypeLabelMap[product.price_type])}
          />
          <ProductDetailInfoRow label={t`Displayed price`} value={formattedPrice} />
          <ProductDetailInfoRow
            label='MOQ'
            value={`${formatPrice(product.moq)} ${product.moq_unit.unit} (${product.moq_unit.id})`}
          />
          <ProductDetailInfoRow label={t`Lead time`} value={leadTime} />
          <ProductDetailInfoRow
            label={t`Type`}
            value={t(productTypeLabelMap[product.product_type])}
          />
        </CardContent>
      </Card>
    </div>
  );
};
