import { useLingui } from '@lingui/react/macro';

import { TabsList, TabsTrigger } from '@/shared/ui/tabs';

interface Props {
  selectedValuesCount: number;
  stockRowsCount: number;
}

export const AttributeStocksStepTabs = ({ selectedValuesCount, stockRowsCount }: Props) => {
  const { t } = useLingui();

  return (
    <TabsList className='grid grid-cols-2 items-stretch p-1'>
      <TabsTrigger value='values'>
        <span className='min-w-0 truncate'>{t`Select values`}</span>
        <span className='text-muted-foreground ml-auto shrink-0 text-xs font-normal'>
          {selectedValuesCount}
        </span>
      </TabsTrigger>
      <TabsTrigger value='quantities'>
        <span className='min-w-0 truncate'>{t`Enter quantities`}</span>
        <span className='text-muted-foreground ml-auto shrink-0 text-xs font-normal'>
          {stockRowsCount}
        </span>
      </TabsTrigger>
    </TabsList>
  );
};
