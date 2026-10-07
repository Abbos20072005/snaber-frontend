import { useLingui } from '@lingui/react/macro';

import { Badge } from '@/shared/ui/badge';

interface Props {
  selectedValuesCount: number;
  stockRowsCount: number;
}

export const AttributeStocksHeader = ({ selectedValuesCount, stockRowsCount }: Props) => {
  const { t } = useLingui();

  return (
    <div className='flex flex-wrap items-start justify-between gap-3'>
      <div className='grid gap-1'>
        <p className='text-sm font-medium'>{t`Attribute stock`}</p>
        <p className='text-muted-foreground text-xs'>
          {t`Select attribute values first, then fill quantities for every generated combination.`}
        </p>
      </div>
      <div className='flex flex-wrap items-center gap-2'>
        <Badge variant={selectedValuesCount > 0 ? 'secondary' : 'outline'}>
          {selectedValuesCount} {t`values selected`}
        </Badge>
        <Badge variant={stockRowsCount > 0 ? 'success' : 'outline'}>
          {stockRowsCount} {t`stock rows`}
        </Badge>
      </div>
    </div>
  );
};
