import { useLingui } from '@lingui/react/macro';

import { priceTypeLabelMap, productTypeLabelMap } from '@/modules/products';
import { formatDate } from '@/shared/lib/format';

import { PublicProductDetailRow } from './PublicProductDetailRow';

interface PublicProductInfoTabProps {
  product: PublicProduct;
  selectedVariant?: ProductVariant;
}

export const PublicProductInfoTab = ({ product, selectedVariant }: PublicProductInfoTabProps) => {
  const { t } = useLingui();

  return (
    <dl>
      <PublicProductDetailRow label={t`Product SKU`} value={product.sku} />
      <PublicProductDetailRow
        label={t`Selected variant SKU`}
        value={selectedVariant?.sku_variant ?? 'N/A'}
      />
      <PublicProductDetailRow label={t`Category`} value={product.category.name} />
      <PublicProductDetailRow
        label={t`Product type`}
        value={t(productTypeLabelMap[product.product_type])}
      />
      <PublicProductDetailRow
        label={t`Price type`}
        value={t(priceTypeLabelMap[product.price_type])}
      />
      <PublicProductDetailRow label={t`Created`} value={formatDate(product.created_at)} />
      <PublicProductDetailRow label={t`Updated`} value={formatDate(product.updated_at)} />
    </dl>
  );
};
