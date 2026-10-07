import { useLingui } from '@lingui/react/macro';
import { EditIcon } from 'lucide-react';

import { localeOptions } from '@/shared/i18n/constants';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';

interface Props {
  data?: Faq;
  openDetail: boolean;
  setEditDialog: (value: boolean) => void;
  setOpenDetail: (value: boolean) => void;
}

export const FaqsDetailDialog = ({ openDetail, setOpenDetail, data, setEditDialog }: Props) => {
  const { t } = useLingui();

  const faqChangeOpenDialog = () => {
    setEditDialog(true);
    setOpenDetail(false);
  };

  return (
    <Dialog onOpenChange={setOpenDetail} open={openDetail}>
      <DialogContent className='max-w-lg'>
        <DialogHeader>
          <DialogTitle>{t`Question and Answer`}</DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          {localeOptions.map(({ value, label }) => (
            <div key={value}>
              <p className='text-primary mb-2 text-xs font-semibold uppercase'>{label}:</p>
              <div className='space-y-2 rounded-lg border p-3'>
                <div className='space-y-1'>
                  <p className='text-sm font-medium'>{data?.[`name_${value}` as keyof Faq]}</p>
                  <p className='text-muted-foreground text-sm'>
                    {data?.[`description_${value}` as keyof Faq]}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button className='cursor-pointer' variant={'outline'} onClick={faqChangeOpenDialog}>
            <EditIcon />
            {t`Edit`}
          </Button>
          <Button className='cursor-pointer' onClick={() => setOpenDetail(false)}>
            {t`Okay`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
