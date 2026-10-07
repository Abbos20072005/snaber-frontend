import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';

import { CompanySocialContact } from './CompanySocialContact';

interface Props {
  children: React.ReactElement;
  socialLinks: CompanyContact;
}

export const CompanyPopover = ({ socialLinks, children }: Props) => {
  return (
    <Popover>
      <PopoverTrigger render={children} />
      <PopoverContent align='end' className='w-full'>
        <CompanySocialContact info={socialLinks} />
      </PopoverContent>
    </Popover>
  );
};
