import { useLingui } from '@lingui/react/macro';
import { parseAsString, useQueryState } from 'nuqs';

import { productTypeLabelMap, productTypeOptions } from '@/modules/products';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';

import { FilterItemLabel } from './FilterItemLabel';

export const ProductTypeFilter = () => {
  const { t } = useLingui();
  const [type, setType] = useQueryState('product_type', parseAsString.withDefault(''));

  return (
    <Select value={type} onValueChange={(val) => setType(val)}>
      <FilterItemLabel label={t`Product type`} />
      <SelectTrigger className='w-full'>
        <SelectValue placeholder={t`Select product type`}>
          {type ? t(productTypeLabelMap[type as ProductType]) : t`Select product type`}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {productTypeOptions.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {t(label)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
