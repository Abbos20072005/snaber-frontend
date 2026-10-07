import type { FC, SVGProps } from 'react';

import { MailIcon, PhoneIcon } from 'lucide-react';

import {
  FacebookIcon,
  InstagramIcon,
  TelegramIcon,
  WebSiteIcon,
  WhatsUpIcon,
  YoutubeIcon
} from '@/shared/ui/icons';

interface SocialItem {
  href: string | null;
  icon: FC<SVGProps<SVGSVGElement>>;
  id: string;
}

interface Props {
  info: CompanyContact;
}
export const CompanySocialContact = ({ info }: Props) => {
  const socialItems: SocialItem[] = [
    {
      id: 'email',
      href: info.email,
      icon: MailIcon
    },
    {
      id: 'phone',
      href: info.phone,
      icon: PhoneIcon
    },
    {
      id: 'instagram',
      href: info.instagram,
      icon: InstagramIcon
    },
    {
      id: 'facebook',
      href: info.facebook,
      icon: FacebookIcon
    },
    {
      id: 'telegram',
      href: info.telegram,
      icon: TelegramIcon
    },
    {
      id: 'whatsapp',
      href: info.whatsapp,
      icon: WhatsUpIcon
    },
    {
      id: 'youtube',
      href: info.youtube,
      icon: YoutubeIcon
    },
    {
      id: 'website',
      href: info.own_site,
      icon: WebSiteIcon
    }
  ];
  const visibleSocialItems = socialItems.filter((item) => item.href);

  if (visibleSocialItems.length === 0) return null;

  return (
    <div className='grid grid-cols-4 grid-rows-2 items-center justify-center gap-3'>
      {visibleSocialItems.map(({ id, href, icon: Icon }) => (
        <a
          href={href ?? undefined}
          key={id}
          className={`inline-flex justify-center`}
          rel='noreferrer'
          target='_blank'
        >
          <Icon className='text-primary size-4 text-base' />
        </a>
      ))}
    </div>
  );
};
