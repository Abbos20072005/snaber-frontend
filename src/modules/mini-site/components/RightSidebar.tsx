import { useLingui } from '@lingui/react/macro';
import { Clock3Icon, MailIcon, MapPinIcon, PhoneIcon, TimerIcon } from 'lucide-react';
import { toast } from 'sonner';

import { SocialLinksSection } from '@/modules/mini-site';
import { formatPhoneNumber } from '@/shared/lib/format';

interface Props {
  className?: string;
  miniSite: MiniSite;
}

export const RightSidebar = ({ className, miniSite }: Props) => {
  const { t } = useLingui();
  const mapUrl = `https://maps.google.com/maps?q=${miniSite.info.latitude},${miniSite.info.longitude}&z=14&output=embed`;

  const handleAddressCopy = async (value?: string) => {
    if (!value) return;

    await navigator.clipboard.writeText(value);

    toast.success(t`Address copied`);
  };

  return (
    <div className={className}>
      <div className='ring-muted rounded-2xl bg-white p-4 pt-0.5 shadow-sm ring-1'>
        <div className='mt-4 space-y-2 text-xs'>
          <div className='text-muted-foreground flex items-center justify-between'>
            <span className='inline-flex items-center gap-2'>
              <Clock3Icon className='text-primary size-3.5' />
              {t`Average response time`}:
            </span>
            <span className='text-primary font-semibold'>
              {miniSite.info.avg_answer_time || '-'}
            </span>
          </div>
          <div className='text-muted-foreground flex items-center justify-between'>
            <span className='inline-flex items-center gap-2'>
              <TimerIcon className='text-primary size-3.5' />
              {t`Average delivery time`}:
            </span>
            <span className='text-primary font-semibold'>
              {miniSite.info.avg_delivery_time || '-'}
            </span>
          </div>
        </div>
        <div className='text-muted-foreground mt-4 grid grid-cols-1 gap-1 border-y py-3 text-xs'>
          <div className='flex justify-between gap-2'>
            <p className='inline-flex items-center gap-2'>
              <PhoneIcon className='text-primary size-3.5' />
              {t`Phone`}:
            </p>
            <a href={`tel:${miniSite.info.phone}`} rel='noreferrer' target='_blank'>
              {miniSite.info.phone ? formatPhoneNumber(miniSite.info.phone) : '-'}
            </a>
          </div>
          <div className='flex justify-between gap-2'>
            <p className='inline-flex items-center gap-2'>
              <MailIcon className='text-primary size-3.5' />
              Email:
            </p>
            <a href={`tel:${miniSite.info.phone}`} rel='noreferrer' target='_blank'>
              {miniSite.info.email || '-'}
            </a>
          </div>
          <div className='flex justify-between gap-2'>
            <p className='inline-flex items-start gap-2'>
              <MapPinIcon className='text-primary mt-0.5 size-3.5' />
              {t`Location`}:
            </p>
            <p
              className='cursor-pointer text-right underline'
              onClick={() =>
                handleAddressCopy(
                  [miniSite.region.name, miniSite.address].filter(Boolean).join(', ')
                )
              }
            >
              {[miniSite.region.name, miniSite.address].filter(Boolean).join(', ') || '-'}
            </p>
          </div>
        </div>
        <SocialLinksSection info={miniSite.info} />
        {mapUrl && (
          <div className='mt-3 h-50 overflow-hidden rounded-lg'>
            <iframe
              className='size-full'
              src={mapUrl}
              loading='lazy'
              referrerPolicy='no-referrer-when-downgrade'
              sandbox='allow-scripts allow-popups'
            />
          </div>
        )}
      </div>
    </div>
  );
};
