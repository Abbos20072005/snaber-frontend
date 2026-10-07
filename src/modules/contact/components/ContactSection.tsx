import { useLingui } from '@lingui/react/macro';

import { Card, CardContent } from '@/shared/ui/card';
import { SectionWrapper } from '@/shared/ui/section-wrapper.tsx';

import { ContactForm } from './ContactForm';

export const ContactSection = () => {
  const { t } = useLingui();

  return (
    <SectionWrapper title={t`Contact`} titleCenter={true}>
      <div className='grid gap-10 lg:grid-cols-2'>
        <img
          alt={t`Contact`}
          className='h-full w-full rounded-2xl object-cover'
          src='/images/contact.png'
        />
        <Card className=''>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
};
