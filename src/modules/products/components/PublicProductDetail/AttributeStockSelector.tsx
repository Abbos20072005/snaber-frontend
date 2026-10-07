import { useLingui } from '@lingui/react/macro';
import { useMemo } from 'react';

import { cn } from '@/shared/lib/utils';

interface AttributeStockOptionProps {
  isDisabled: boolean;
  isSelected: boolean;
  value: ProductVariantAttributeStock['attribute_values'][number];
  onSelect: (id: number) => void;
}

interface AttributeStockGroup {
  label: string;
  values: ProductVariantAttributeStock['attribute_values'];
}

interface VisibleAttributeStockGroup extends AttributeStockGroup {
  groupIndex: number;
}

interface AttributeStockSelectorProps {
  className?: string;
  selectedStockId?: number;
  variant?: ProductVariant;
  onStockChange?: (stock?: ProductVariantAttributeStock) => void;
}

const getAttributeStockGroups = (
  variant: ProductVariant | undefined,
  getFallbackLabel: (index: number) => string
): AttributeStockGroup[] => {
  if (!variant?.attribute_stocks.length) return [];

  const attributeNameByValueId = new Map(
    variant.attributes.map((attribute) => [attribute.value.id, attribute.name])
  );
  const valuesByGroup = new Map<number, ProductVariantAttributeStock['attribute_values']>();
  const labelByGroup = new Map<number, string>();

  variant.attribute_stocks.forEach((stock) => {
    stock.attribute_values.forEach((attributeValue, index) => {
      const label = attributeNameByValueId.get(attributeValue.id);
      const values = valuesByGroup.get(index) ?? [];

      if (!values.some((value) => value.id === attributeValue.id)) values.push(attributeValue);
      if (label && !labelByGroup.has(index)) labelByGroup.set(index, label);

      valuesByGroup.set(index, values);
    });
  });

  return Array.from(valuesByGroup, ([index, values]) => ({
    label: labelByGroup.get(index) ?? getFallbackLabel(index),
    values
  }));
};

const getSelectedAttributeValueIds = (stock?: ProductVariantAttributeStock) =>
  new Set(stock?.attribute_values.map((attributeValue) => attributeValue.id) ?? []);

const AttributeStockOption = ({
  isDisabled,
  isSelected,
  value,
  onSelect
}: AttributeStockOptionProps) => (
  <button
    className={cn(
      'hover:border-primary/60 hover:bg-primary/5 inline-flex max-w-full items-center rounded-md border px-3 py-2 text-sm font-medium transition',
      isSelected && 'border-foreground bg-background text-foreground',
      isDisabled &&
        'text-muted-foreground pointer-events-none border-dashed bg-muted/20 opacity-60'
    )}
    disabled={isDisabled}
    title={value.value}
    type='button'
    onClick={() => onSelect(value.id)}
  >
    <span className='min-w-0 truncate'>{value.value}</span>
  </button>
);

export const AttributeStockSelector = ({
  className,
  selectedStockId,
  variant,
  onStockChange
}: AttributeStockSelectorProps) => {
  const { t } = useLingui();

  const groups = useMemo(
    () =>
      getAttributeStockGroups(variant, (index) => {
        const optionNumber = index + 1;

        return t`Option ${optionNumber}`;
      }),
    [t, variant]
  );
  const selectedStock =
    variant?.attribute_stocks.find((stock) => stock.id === selectedStockId) ??
    variant?.attribute_stocks[0];
  const selectedValueIds = useMemo(
    () => getSelectedAttributeValueIds(selectedStock),
    [selectedStock]
  );

  const getSelectedValueIdsInGroupRange = (startIndex: number, endIndex: number) =>
    groups.slice(startIndex, endIndex).flatMap((group) => {
      const selectedValue = selectedStock?.attribute_values.find((attributeValue) =>
        group.values.some((value) => value.id === attributeValue.id)
      );

      return selectedValue ? [selectedValue.id] : [];
    });

  const findStockByValueIds = (valueIds: number[]) =>
    variant?.attribute_stocks.find((stock) =>
      valueIds.every((valueId) =>
        stock.attribute_values.some((attributeValue) => attributeValue.id === valueId)
      )
    );

  const handleAttributeValueSelect = (attributeValueId: number, groupIndex: number) => {
    if (!variant) return;

    const parentValueIds = getSelectedValueIdsInGroupRange(0, groupIndex);
    const childValueIds = getSelectedValueIdsInGroupRange(groupIndex + 1, groups.length);
    const nextStock =
      findStockByValueIds([...parentValueIds, attributeValueId, ...childValueIds]) ??
      findStockByValueIds([...parentValueIds, attributeValueId]) ??
      variant.attribute_stocks.find((stock) =>
        stock.attribute_values.some((attributeValue) => attributeValue.id === attributeValueId)
      ) ??
      variant.attribute_stocks[0];

    onStockChange?.(nextStock);
  };

  const isAttributeValueAvailable = (attributeValueId: number, groupIndex: number) =>
    !!findStockByValueIds([...getSelectedValueIdsInGroupRange(0, groupIndex), attributeValueId]);

  const visibleGroups: VisibleAttributeStockGroup[] = groups.flatMap((group, groupIndex) => {
    const availableValues = group.values.filter((value) =>
      isAttributeValueAvailable(value.id, groupIndex)
    );

    return availableValues.length > 0
      ? [{ ...group, values: availableValues, groupIndex }]
      : [];
  });

  if (!variant?.attribute_stocks.length || visibleGroups.length === 0) return null;

  return (
    <div className={cn('space-y-4', className)}>
      {visibleGroups.map((group) => {
        const selectedValue = selectedStock?.attribute_values.find((attributeValue) =>
          group.values.some((value) => value.id === attributeValue.id)
        );

        return (
          <div key={group.label} className='space-y-3'>
            <p className='text-sm font-semibold'>
              {group.label}: {selectedValue?.value}
            </p>
            <div className='flex flex-wrap gap-2'>
              {group.values.map((value) => (
                <AttributeStockOption
                  key={value.id}
                  isDisabled={!isAttributeValueAvailable(value.id, group.groupIndex)}
                  isSelected={selectedValueIds.has(value.id)}
                  value={value}
                  onSelect={(id) => handleAttributeValueSelect(id, group.groupIndex)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
