import { useLingui } from '@lingui/react/macro';

import { PublicProductDetailRow } from '@/modules/products';

interface PublicProductCharacteristicsTabProps {
  product: PublicProduct;
}

export const PublicProductCharacteristicsTab = ({
  product
}: PublicProductCharacteristicsTabProps) => {
  const { t } = useLingui();

  const rows = [
    ...product.attributes.map((attribute) => ({
      name: attribute.name,
      value: attribute.value.value
    })),
    ...product.characteristics.map(({ name, value }) => ({ name, value }))
  ];

  if (!rows.length)
    return <p className='text-muted-foreground text-sm'>{t`No characteristics available.`}</p>;

  return (
    <dl>
      {rows.map((row) => (
        <PublicProductDetailRow
          key={`${row.name}-${row.value}`}
          label={row.name}
          value={row.value}
        />
      ))}
    </dl>
  );
};
