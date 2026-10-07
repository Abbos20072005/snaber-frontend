import { useLingui } from '@lingui/react/macro';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

import {
  getFormattedProductPrice,
  getProductAllMedias,
  getProductLeadTimeLabel,
  getProductTotalStock,
  PRODUCT_DETAIL_TAB_VALUES
} from './constants';
import { ProductDetailActivityTab } from './ProductDetailActivityTab';
import { ProductDetailHero } from './ProductDetailHero';
import { ProductDetailMediaTab } from './ProductDetailMediaTab';
import { ProductDetailOverviewTab } from './ProductDetailOverviewTab';
import { ProductDetailVariantsTab } from './ProductDetailVariantsTab';

interface Props {
  enableActions?: boolean;
  product: Product;
  url?: '/admin/product-checks' | '/admin/products' | '/seller/product-checks' | '/seller/products';
}

export const ProductDetailView = ({ product, enableActions, url }: Props) => {
  const { t } = useLingui();

  if (!product) return <></>;

  const totalStock = getProductTotalStock(product);
  const allMedias = getProductAllMedias(product);
  const leadTime = getProductLeadTimeLabel(product, t`days`);
  const formattedPrice = getFormattedProductPrice(product, t`On request`);

  return (
    <div className='space-y-4'>
      <ProductDetailHero
        leadTime={leadTime}
        formattedPrice={formattedPrice}
        product={product}
        totalStock={totalStock}
      />
      <Tabs defaultValue={PRODUCT_DETAIL_TAB_VALUES.overview}>
        <TabsList className='grid w-full grid-cols-4' variant='line'>
          <TabsTrigger value={PRODUCT_DETAIL_TAB_VALUES.overview}>{t`Overview`}</TabsTrigger>
          <TabsTrigger value={PRODUCT_DETAIL_TAB_VALUES.variants}>
            {t`Variants`} ({product.variants.length})
          </TabsTrigger>
          <TabsTrigger value={PRODUCT_DETAIL_TAB_VALUES.media}>
            {t`Media`} ({allMedias.length})
          </TabsTrigger>
          <TabsTrigger value={PRODUCT_DETAIL_TAB_VALUES.activity}>{t`Activity`}</TabsTrigger>
        </TabsList>
        <TabsContent className='space-y-4 pt-3' value={PRODUCT_DETAIL_TAB_VALUES.overview}>
          <ProductDetailOverviewTab
            leadTime={leadTime}
            formattedPrice={formattedPrice}
            product={product}
          />
        </TabsContent>
        <TabsContent className='space-y-4 pt-3' value={PRODUCT_DETAIL_TAB_VALUES.variants}>
          <ProductDetailVariantsTab url={url} enableActions={enableActions} product={product} />
        </TabsContent>
        <TabsContent className='space-y-4 pt-3' value={PRODUCT_DETAIL_TAB_VALUES.media}>
          <ProductDetailMediaTab medias={allMedias} />
        </TabsContent>
        <TabsContent className='pt-3' value={PRODUCT_DETAIL_TAB_VALUES.activity}>
          <ProductDetailActivityTab mediaCount={allMedias.length} product={product} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
