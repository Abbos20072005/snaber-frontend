import { useLingui } from '@lingui/react/macro';

import { PublicProductDetailRow } from '@/modules/products';

interface PublicProductCharacteristicsTabProps {
  selectedVariant?: ProductVariant;
}

export const PublicProductCharacteristicsTab = ({
  selectedVariant
}: PublicProductCharacteristicsTabProps) => {
  const { t } = useLingui();
  const attributes =
    selectedVariant?.attributes.map((attribute) => ({
      name: attribute.name,
      value: attribute.value.value
    })) ?? [];
  const characteristics =
    selectedVariant?.characteristics.map((characteristic) => ({
      name: characteristic.name,
      value: characteristic.value
    })) ?? [];

  return (
    <section className='space-y-2'>
      {attributes.length ? (
        <dl>
          {attributes.map((attribute) => (
            <PublicProductDetailRow
              key={`${attribute.name}-${attribute.value}`}
              label={attribute.name}
              value={attribute.value}
            />
          ))}
        </dl>
      ) : (
        <p className='text-muted-foreground text-sm'>{t`No attributes available.`}</p>
      )}
      {characteristics.length ? (
        <dl>
          {characteristics.map((characteristic) => (
            <PublicProductDetailRow
              key={`${characteristic.name}-${characteristic.value}`}
              label={characteristic.name}
              value={characteristic.value}
            />
          ))}
        </dl>
      ) : (
        <p className='text-muted-foreground text-sm'>{t`No characteristics available.`}</p>
      )}
    </section>
  );
};
