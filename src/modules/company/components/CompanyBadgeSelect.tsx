import { useLingui } from '@lingui/react/macro';

import { productTypeLabelMap, productTypeOptions } from '@/modules/products';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/shared/ui/select';

interface Props {
  badge: ProductType | null;
  onBadgeChange: (value: ProductType | null) => void;
}

export const CompanyBadgeSelect = ({ badge, onBadgeChange }: Props) => {
  const { t } = useLingui();

  return (
    <Select value={badge} onValueChange={(value) => onBadgeChange(value)}>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder={t`Select status`}>
          {badge ? `${t(productTypeLabelMap[badge as ProductType])}` : t`Select status`}
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
