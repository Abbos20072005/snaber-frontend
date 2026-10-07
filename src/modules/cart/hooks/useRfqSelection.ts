import { useState } from 'react';

import { mergeAttributeValues } from '../components/rfq-dialog/helpers.ts';

export const useRfqSelection = (product: PublicProduct) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const defaultAttributes = mergeAttributeValues(
    selectedVariant.attribute_stocks,
    selectedVariant.attributes
  );
  const [attributes, setAttributes] = useState<NonNullable<CartItemDto['attributes']>>(
    defaultAttributes.map((item) => ({
      attribute: item.id,
      value_option: item.values[0].id
    }))
  );

  const onVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant);
    setAttributes(
      mergeAttributeValues(variant.attribute_stocks, variant.attributes).map((item) => ({
        attribute: item.id,
        value_option: item.values[0].id
      }))
    );
  };

  const isValid = attributes.every((attr) => {
    if ('value' in attr) {
      return attr.value && attr.value.trim() !== '';
    }
    return true;
  });

  return {
    selectedVariant,
    attributes,
    setAttributes,
    onVariantChange,
    isValid
  };
};
