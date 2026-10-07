import { useLingui } from '@lingui/react/macro';
import { createFileRoute } from '@tanstack/react-router';

import { Preferences, SettingsGeneralTab, SettingsSecurityTab } from '@/modules/seller';
import { Button } from '@/shared/ui/button';
import { PageContent, PageHeader } from '@/shared/ui/page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

const SellerSettingsPage = () => {
  const { t } = useLingui();
  return (
    <>
      <PageHeader>
        <Button type='submit' form='seller-settings-form'>
          {t`Save changes`}
        </Button>
      </PageHeader>
      <PageContent className='relative overflow-x-hidden'>
        <div className='grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]'>
          <Tabs className='gap-4' defaultValue='general'>
            <TabsList className='w-full' variant='line'>
              <TabsTrigger value='general'>{t`General`}</TabsTrigger>
              <TabsTrigger value='security'>{t`Security`}</TabsTrigger>
            </TabsList>

            <TabsContent value='general'>
              <SettingsGeneralTab />
            </TabsContent>
            <TabsContent value='security'>
              <SettingsSecurityTab />
            </TabsContent>
          </Tabs>
          <Preferences />
        </div>
      </PageContent>
    </>
  );
};

export const Route = createFileRoute('/seller/settings/')({
  component: SellerSettingsPage
});
