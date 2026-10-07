import { useLingui } from '@lingui/react/macro';

import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { SectionWrapper } from '@/shared/ui/section-wrapper';

export const OnboardingSection = () => {
  const { t } = useLingui();

  return (
    <SectionWrapper
      title={t`Join Us`}
      description={t`We provide effective collaboration and professional development opportunities for businesses. Achieve sustainable growth and outstanding results through partnership.`}
    >
      <div className='grid gap-4 md:grid-cols-2'>
        <Card className='w-full border'>
          <CardHeader>
            <CardTitle>{t`Are you a company?`}</CardTitle>
            <CardDescription>
              {t`Find a reliable partner for your business. Quickly and effectively collaborate with verified companies, services, and specialists through our platform.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant={'outline'}>{t`Find a partner`}</Button>
          </CardContent>
        </Card>
        <Card className='border-primary w-full border'>
          <CardHeader>
            <CardTitle>{t`Are you a service provider?`}</CardTitle>
            <CardDescription>
              {t`Present your services to a wide audience. Find new clients and grow your business through our platform.`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button>{t`Sign up`}</Button>
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
};
