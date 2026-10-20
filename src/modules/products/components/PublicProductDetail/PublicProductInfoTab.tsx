import { useLingui } from '@lingui/react/macro';

import { formatDate } from '@/shared/lib/format';

import { PublicProductDetailRow } from './PublicProductDetailRow';

interface PublicProductInfoTabProps {
  product: PublicProduct;
}

export const PublicProductInfoTab = ({ product }: PublicProductInfoTabProps) => {
  const { t } = useLingui();

  return (
    <dl>
      {product.sku && <PublicProductDetailRow label={t`Product SKU`} value={product.sku} />}
      <PublicProductDetailRow label={t`Category`} value={product.category.name} />
      {product.unit && <PublicProductDetailRow label={t`Unit`} value={product.unit.unit} />}
      <PublicProductDetailRow label={t`Created`} value={formatDate(product.created_at)} />
      <PublicProductDetailRow label={t`Updated`} value={formatDate(product.updated_at)} />
    </dl>
  );
};
