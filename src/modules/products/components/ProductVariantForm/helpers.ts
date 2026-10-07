import type { ProductVariantSchemaForm } from './constants';

export interface AttributeStockSelectedValue {
  attribute: Attribute;
  value: AttributeValue;
}

export interface AttributeStockSelectedGroup {
  attribute: Attribute;
  values: AttributeValue[];
}

export const getAttributeValuesByAttribute = (
  attributes: Attribute[]
) => {
  const map = new Map<number, AttributeValue[]>();

  attributes.forEach((attribute) => {
    if (attribute.values.length > 0) map.set(attribute.id, attribute.values);
  });

  return map;
};

export const getAttributesWithValues = (attributes: Attribute[]) =>
  attributes.filter((attribute) => attribute.values.length > 0);

export const getAttributeValuesCount = (attributes: Attribute[]) =>
  attributes.reduce((count, attribute) => count + attribute.values.length, 0);

export const getSelectedAttributeValues = (
  attributes: ProductVariantSchemaForm['attributes'],
  currentIndex: number
) =>
  new Set(
    attributes
      .filter((_, itemIndex) => itemIndex !== currentIndex)
      .map((selectedItem) => selectedItem.attribute.value)
      .filter((value) => value.length > 0)
  );

export const getAvailableAttributes = (
  attributes: Attribute[],
  currentValue: string,
  selectedAttributeValues: Set<string>
) =>
  attributes.filter(
    (attribute) =>
      `${attribute.id}` === currentValue || !selectedAttributeValues.has(`${attribute.id}`)
  );

export const toAttributeSelectItems = (attributes: Attribute[]) =>
  attributes.map((attribute) => ({
    label: attribute.name,
    value: `${attribute.id}`
  }));

export const toAttributeValueSelectItems = (attributeValues: AttributeValue[]) =>
  attributeValues.map((attributeValue) => ({
    label: attributeValue.value,
    value: `${attributeValue.id}`
  }));

export const getAttributeStockCombinationKey = (attributeValueIds: string[]) =>
  [...attributeValueIds].sort((firstValueId, secondValueId) => {
    const firstValue = Number(firstValueId);
    const secondValue = Number(secondValueId);

    if (Number.isNaN(firstValue) || Number.isNaN(secondValue))
      return firstValueId.localeCompare(secondValueId);

    return firstValue - secondValue;
  }).join(':');

export const getAttributeStockQuantityByCombinationKey = (
  attributeStocks: ProductVariantSchemaForm['attribute_stocks']
) => {
  const quantityByKey = new Map<string, string>();

  attributeStocks.forEach((stock) => {
    const key = getAttributeStockCombinationKey(
      stock.attribute_values.map((attributeValue) => attributeValue.value)
    );

    if (key) quantityByKey.set(key, stock.quantity);
  });

  return quantityByKey;
};

export const getSelectedAttributeStockGroups = ({
  attributeStocks,
  attributesWithValues
}: {
  attributeStocks: ProductVariantSchemaForm['attribute_stocks'];
  attributesWithValues: Attribute[];
}): AttributeStockSelectedGroup[] => {
  const selectedValueIds = new Set(
    attributeStocks.flatMap((stock) =>
      stock.attribute_values.map((attributeValue) => attributeValue.value)
    )
  );

  return attributesWithValues.flatMap((attribute) => {
    const values = attribute.values.filter((attributeValue) =>
      selectedValueIds.has(`${attributeValue.id}`)
    );

    return values.length > 0 ? [{ attribute, values }] : [];
  });
};

export const getAttributeStockCombinations = (
  groups: AttributeStockSelectedGroup[]
): AttributeStockSelectedValue[][] => {
  if (groups.length === 0) return [];

  return groups.reduce<AttributeStockSelectedValue[][]>((combinations, group) => {
    const groupValues = group.values.map((value) => ({
      attribute: group.attribute,
      value
    }));

    if (combinations.length === 0) return groupValues.map((value) => [value]);

    return combinations.flatMap((combination) =>
      groupValues.map((value) => [...combination, value])
    );
  }, []);
};

export const toAttributeStockFormItems = ({
  combinations,
  quantityByKey
}: {
  combinations: AttributeStockSelectedValue[][];
  quantityByKey: Map<string, string>;
}): ProductVariantSchemaForm['attribute_stocks'] =>
  combinations.map((combination) => {
    const attributeValueIds = combination.map((item) => `${item.value.id}`);
    const key = getAttributeStockCombinationKey(attributeValueIds);

    return {
      attribute_values: combination.map((item) => ({
        value: `${item.value.id}`,
        label: `${item.attribute.name}: ${item.value.value}`
      })),
      quantity: quantityByKey.get(key) ?? ''
    };
  });

export const getAttributeStockValueLabels = ({
  attributeStock,
  attributesWithValues
}: {
  attributeStock: ProductVariantSchemaForm['attribute_stocks'][number];
  attributesWithValues: Attribute[];
}) =>
  attributeStock.attribute_values.map((selectedValue, index) => {
    const attribute = attributesWithValues.find((item) =>
      item.values.some((attributeValue) => `${attributeValue.id}` === selectedValue.value)
    );
    const attributeValue = attribute?.values.find(
      (item) => `${item.id}` === selectedValue.value
    );

    return {
      key: `${selectedValue.value}-${index}`,
      attributeName: attribute?.name,
      value: attributeValue?.value ?? selectedValue.label
    };
  });


