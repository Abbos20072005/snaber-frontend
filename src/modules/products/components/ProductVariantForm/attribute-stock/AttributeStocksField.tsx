import { useMemo, useState } from 'react';

import {
  AttributeStockQuantitiesStep,
  AttributeStocksStepTabs,
  AttributeStockValuesStep
} from '@/modules/products';
import { Tabs, TabsContent } from '@/shared/ui/tabs';

import type { ProductVariantSchemaForm } from '../constants';
import type { ProductVariantAnyField, ProductVariantFormApi } from '../types';

import {
  getAttributeStockCombinations,
  getAttributeStockQuantityByCombinationKey,
  getSelectedAttributeStockGroups,
  toAttributeStockFormItems
} from '../helpers';
import { AttributeStocksHeader } from './AttributeStocksHeader';

interface AttributeStocksFieldProps {
  attributesWithValues: Attribute[];
  attributeValuesByAttribute: Map<number, AttributeValue[]>;
  attributeValuesCount: number;
  form: ProductVariantFormApi;
  isAttributesLoading: boolean;
}

interface AttributeStocksFieldContentProps extends AttributeStocksFieldProps {
  field: ProductVariantAnyField;
}

export type AttributeStockStep = 'quantities' | 'values';

export const AttributeStocksField = ({
  attributeValuesByAttribute,
  attributeValuesCount,
  attributesWithValues,
  form,
  isAttributesLoading
}: AttributeStocksFieldProps) => {
  return (
    <form.AppField name='attribute_stocks'>
      {(field: ProductVariantAnyField) => (
        <AttributeStocksFieldContent
          attributesWithValues={attributesWithValues}
          attributeValuesByAttribute={attributeValuesByAttribute}
          field={field}
          attributeValuesCount={attributeValuesCount}
          form={form}
          isAttributesLoading={isAttributesLoading}
        />
      )}
    </form.AppField>
  );
};

const AttributeStocksFieldContent = ({
  attributeValuesByAttribute,
  attributeValuesCount,
  attributesWithValues,
  field,
  form,
  isAttributesLoading
}: AttributeStocksFieldContentProps) => {
  const [activeStep, setActiveStep] = useState<AttributeStockStep>('values');
  const attributeStocks = field.state.value as ProductVariantSchemaForm['attribute_stocks'];

  const selectedGroups = useMemo(
    () =>
      getSelectedAttributeStockGroups({
        attributeStocks,
        attributesWithValues
      }),
    [attributeStocks, attributesWithValues]
  );

  const selectedValueIds = useMemo(
    () =>
      new Set(
        selectedGroups.flatMap((group) =>
          group.values.map((attributeValue) => `${attributeValue.id}`)
        )
      ),
    [selectedGroups]
  );

  const selectedValuesCount = selectedValueIds.size;

  const regenerateAttributeStocks = (nextGroups: typeof selectedGroups) => {
    const combinations = getAttributeStockCombinations(nextGroups);
    const quantityByKey = getAttributeStockQuantityByCombinationKey(attributeStocks);

    field.handleChange(
      toAttributeStockFormItems({
        combinations,
        quantityByKey
      })
    );
  };

  const handleAttributeValueToggle = (attribute: Attribute, attributeValue: AttributeValue) => {
    const valueId = `${attributeValue.id}`;
    const nextGroups = attributesWithValues.flatMap((item) => {
      const currentGroup = selectedGroups.find((group) => group.attribute.id === item.id);
      const selectedIds = new Set(
        currentGroup?.values.map((selectedValue) => `${selectedValue.id}`) ?? []
      );

      if (item.id === attribute.id) {
        if (selectedIds.has(valueId)) selectedIds.delete(valueId);
        else selectedIds.add(valueId);
      }

      const values = item.values.filter((value) => selectedIds.has(`${value.id}`));

      return values.length > 0 ? [{ attribute: item, values }] : [];
    });

    regenerateAttributeStocks(nextGroups);
  };

  const handleAttributeValuesSelect = (attribute: Attribute) => {
    const nextGroups = attributesWithValues.flatMap((item) => {
      if (item.id === attribute.id) return [{ attribute: item, values: item.values }];

      const currentGroup = selectedGroups.find((group) => group.attribute.id === item.id);

      return currentGroup ? [currentGroup] : [];
    });

    regenerateAttributeStocks(nextGroups);
  };

  const handleAttributeValuesClear = (attribute: Attribute) => {
    regenerateAttributeStocks(
      selectedGroups.filter((group) => group.attribute.id !== attribute.id)
    );
  };

  return (
    <div className='grid gap-4'>
      <AttributeStocksHeader
        selectedValuesCount={selectedValuesCount}
        stockRowsCount={attributeStocks.length}
      />
      <Tabs
        className='gap-4'
        value={activeStep}
        onValueChange={(value) => setActiveStep(value as AttributeStockStep)}
      >
        <AttributeStocksStepTabs
          selectedValuesCount={selectedValuesCount}
          stockRowsCount={attributeStocks.length}
        />
        <TabsContent value='values'>
          <AttributeStockValuesStep
            attributesWithValues={attributesWithValues}
            attributeValuesByAttribute={attributeValuesByAttribute}
            selectedValueIds={selectedValueIds}
            attributeValuesCount={attributeValuesCount}
            isAttributesLoading={isAttributesLoading}
            onAttributeValuesClear={handleAttributeValuesClear}
            onAttributeValuesSelect={handleAttributeValuesSelect}
            onAttributeValueToggle={handleAttributeValueToggle}
            onContinue={() => setActiveStep('quantities')}
            selectedValuesCount={selectedValuesCount}
          />
        </TabsContent>
        <TabsContent value='quantities'>
          <AttributeStockQuantitiesStep
            attributesWithValues={attributesWithValues}
            attributeStocks={attributeStocks}
            form={form}
            onBack={() => setActiveStep('values')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
