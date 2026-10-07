import { useLingui } from '@lingui/react/macro';

import { cn } from '@/shared/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/shared/ui/tabs';

interface Props {
  className?: string;
}

export const ChatGroupsTabs = ({ className }: Props) => {
  const { t } = useLingui();

  const groups = [{ value: 'all', label: t`All messages` }];

  return (
    <Tabs className={cn('gap-0', className)} defaultValue='all'>
      <div className='no-scrollbar overflow-x-auto'>
        <TabsList className='mb-1' variant='line'>
          {groups.map((group) => (
            <TabsTrigger key={group.value} className='text-xs' value={group.value}>
              {group.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
    </Tabs>
  );
};
