export function mergeAttributeValues(
  stocks: ProductVariantAttributeStock[],
  attributes: ProductVariantAttribute[]
) {
  const valueIdToAttr = new Map<number, { id: number; name: string }>(
    attributes.map((attr) => [attr.value.id, { id: attr.id, name: attr.name }])
  );

  const slotMap = new Map<number, { id: number; name: string; values: Map<number, string> }>();

  for (const stock of stocks) {
    stock.attribute_values.forEach((attrVal, index) => {
      if (!slotMap.has(index)) {
        const meta = valueIdToAttr.get(attrVal.id);
        slotMap.set(index, {
          id: meta?.id ?? 0,
          name: meta?.name ?? '',
          values: new Map()
        });
      }
      slotMap.get(index)!.values.set(attrVal.id, attrVal.value);
    });
  }

  return Array.from(slotMap.values()).map(({ id, name, values }) => ({
    id,
    name,
    values: Array.from(values.entries()).map(([id, value]) => ({ id, value }))
  }));
}
