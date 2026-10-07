import { useLingui } from '@lingui/react/macro';
import { ClipboardCheck } from 'lucide-react';

import {
  PublicProductCharacteristicsTab,
  PublicProductDescriptionTab,
  PublicProductInfoTab
} from '@/modules/products';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

interface PublicProductTabsProps {
  activeTab?: string;
  product: PublicProduct;
  selectedVariant?: ProductVariant;
  onTabChange?: (tab: string) => void;
}

export const PublicProductTabs = ({
  activeTab,
  product,
  selectedVariant,
  onTabChange
}: PublicProductTabsProps) => {
  const { t } = useLingui();

  return (
    <div className='scroll-mt-24' id='product-full-characteristics'>
    <Tabs
      className='gap-4'
      {...(activeTab && onTabChange
        ? { value: activeTab, onValueChange: (value: string) => onTabChange(value) }
        : { defaultValue: 'info' })}
    >
      <TabsList className='w-full justify-start' variant='line'>
        <TabsTrigger value='info'>{t`Info`}</TabsTrigger>
        <TabsTrigger value='characteristics'>{t`Characteristics`}</TabsTrigger>
        <TabsTrigger value='description'>{t`Description`}</TabsTrigger>
      </TabsList>
      <TabsContent value='info'>
        <Card className='rounded-lg'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-xl'>
              <ClipboardCheck className='text-primary size-5' />
              {t`Product details`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PublicProductInfoTab selectedVariant={selectedVariant} product={product} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value='characteristics'>
        <Card className='rounded-lg'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-xl'>
              <ClipboardCheck className='text-primary size-5' />
              {t`Characteristics`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PublicProductCharacteristicsTab selectedVariant={selectedVariant} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value='description'>
        <Card className='rounded-lg'>
          <CardHeader>
            <CardTitle className='text-xl'>{t`Description`}</CardTitle>
          </CardHeader>
          <CardContent>
            <PublicProductDescriptionTab selectedVariant={selectedVariant} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
    </div>
  );
};
