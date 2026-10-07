import { Badge } from '@/shared/ui/badge';
import { Popover, PopoverContent, PopoverHeader, PopoverTrigger } from '@/shared/ui/popover';

interface Props {
  industries: Industry[];
}

export const CompanyIndustryPopover = ({ industries }: Props) => {
  return (
    <Popover>
      <PopoverTrigger>
        <Badge className='cursor-pointer' variant={'secondary'}>
          ...
        </Badge>
      </PopoverTrigger>
      <PopoverContent align='center'>
        <PopoverHeader>
          <div className='flex flex-wrap gap-1.5'>
            {industries.map((item) => (
              <Badge
                key={item.id}
                className='flex items-center justify-center'
                variant={'secondary'}
              >
                {item.name}
              </Badge>
            ))}
          </div>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
};
