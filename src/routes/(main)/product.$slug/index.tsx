import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link, useParams } from '@tanstack/react-router';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useState } from 'react';
// FEATURE DISABLED: Product comments (auth-gated).
// import { Suspense } from 'react';

// import { ProductCommentSection, ProductCommentSectionSkeleton } from '@/modules/comment';
import { currencySymbolMap } from '@/modules/currency';
import {
  getGallery,
  getLeadTimeLabel,
  getPublicProductByIdQueryOptions,
  PublicProductAside,
  PublicProductDetailSkeleton,
  PublicProductGallery,
  PublicProductSummary,
  PublicProductTabs
} from '@/modules/products';
import { extractSlugId, generateSlugId } from '@/shared/constants';
import { getLocale } from '@/shared/i18n';
import { formatPrice } from '@/shared/lib/format';
import {
  createBreadcrumbJsonLd,
  createProductJsonLd,
  createSeoMeta,
  DEFAULT_OG_IMAGE
} from '@/shared/lib/seo';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/shared/ui/breadcrumb';
import { GeneralError, NotFoundError } from '@/shared/ui/errors';

const PublicProductDetailPage = () => {
  const { t } = useLingui();
  const { slug } = useParams({ from: '/(main)/product/$slug/' });
  const productId = extractSlugId(slug);

  const productQuery = useSuspenseQuery(getPublicProductByIdQueryOptions({ id: +productId }));

  const [activeImageSrc, setActiveImageSrc] = useState<string>();
  const [activeTab, setActiveTab] = useState('info');

  const product = productQuery.data;
  const defaultVariantId = product.variants[0]?.id ?? 0;
  const [selectedVariantId, setSelectedVariantId] = useQueryState(
    'variant',
    parseAsInteger.withDefault(defaultVariantId)
  );

  const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId);
  const gallery = getGallery(product, selectedVariant);

  const basePrice = `${formatPrice(product.price_min)}-${formatPrice(product.price_max)}${currencySymbolMap[product.currency]}`;
  const selectedPrice = selectedVariant
    ? `${formatPrice(selectedVariant.price_override)}${currencySymbolMap[product.currency]}`
    : '';
  const totalStock = product.variants.reduce((sum, variant) => sum + variant.stock_quantity, 0);
  const leadTime = getLeadTimeLabel(product);
  const handleShowAllCharacteristics = () => {
    setActiveTab('characteristics');
    document
      .getElementById('product-full-characteristics')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const handleVariantChange = (variant: ProductVariant) => {
    const nextVariant = product.variants.find((v) => v.id === variant.id) || product.variants[0];

    void setSelectedVariantId(variant.id);
    setActiveImageSrc(getGallery(product, nextVariant)[0]?.src);
  };

  return (
    <div className='container space-y-6 py-4 lg:py-8'>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to='/'>{t`Home`}</Link>} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to='/catalog'>{t`Catalog`}</Link>} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className='text-primary text-2xl leading-tight font-bold'>{product.name}</h1>

      <div className='grid items-start gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.75fr)_300px]'>
        <PublicProductGallery
          key={selectedVariant?.id ?? product.product_id}
          activeImageSrc={activeImageSrc}
          gallery={gallery}
          onActiveImageChange={setActiveImageSrc}
        />
        <PublicProductSummary
          selectedVariant={selectedVariant}
          onShowAll={handleShowAllCharacteristics}
        />
        <PublicProductAside
          basePrice={basePrice}
          leadTime={leadTime}
          selectedPrice={selectedPrice}
          selectedVariant={selectedVariant}
          onVariantChange={handleVariantChange}
          product={product}
          totalStock={totalStock}
        />
      </div>

      <div className='space-y-6'>
        {/* FEATURE DISABLED: Product comments (auth-gated). */}
        {/* <Suspense fallback={<ProductCommentSectionSkeleton />}> */}
        {/*   {selectedVariant && <ProductCommentSection currentVariant={selectedVariant} />} */}
        {/* </Suspense> */}
        <PublicProductTabs
          activeTab={activeTab}
          selectedVariant={selectedVariant}
          onTabChange={setActiveTab}
          product={product}
        />
      </div>
    </div>
  );
};

const getSeoVariant = (product: PublicProduct, variantId?: number) =>
  product.variants.find((variant) => variant.id === variantId) ?? product.variants[0];

export const Route = createFileRoute('/(main)/product/$slug/')({
  loader: ({ context: { queryClient }, params: { slug }, location: { search } }) => {
    const id = extractSlugId(slug);

    const variant = (
      search as {
        variant: number | undefined;
      }
    ).variant;

    const variantPromise = new Promise((resolve) => {
      resolve(variant ?? undefined);
    });

    return Promise.all([
      queryClient.ensureQueryData(getPublicProductByIdQueryOptions({ id })),
      variantPromise
    ]);
  },
  head: ({ loaderData, match }) => {
    const product = loaderData?.[0];
    const variantId = loaderData?.[1] as number | undefined;
    const siteUrl = import.meta.env.VITE_SITE_URL || '';

    if (!product) {
      return {
        ...createSeoMeta({
          title: 'Product details',
          description:
            'View product details, prices, variants, supplier information, and order terms.',
          locale: getLocale()
        })
      };
    }

    const productName = product.name;
    const companyName = product.company.name;
    const categoryName = product.category.name;
    const seoVariant = getSeoVariant(product, variantId);
    const variantDescription = seoVariant?.description;
    const fallbackDescription = `Find ${productName} from ${companyName} in ${categoryName} on snaber.uz — building materials and tools.`;
    const seoImage = getGallery(product, seoVariant)[0]?.src;
    const canonicalUrl = siteUrl ? `${siteUrl}${match.pathname}` : undefined;
    const priceRange = `${formatPrice(product.price_min)}-${formatPrice(product.price_max)}`;
    const categoryUrl = `${siteUrl}/catalog/${generateSlugId(product.category.id, categoryName)}`;

    return {
      ...createSeoMeta({
        title: productName,
        description: variantDescription || fallbackDescription,
        image: seoImage || (siteUrl ? `${siteUrl}${DEFAULT_OG_IMAGE.url}` : DEFAULT_OG_IMAGE.url),
        imageWidth: seoImage ? undefined : DEFAULT_OG_IMAGE.width,
        imageHeight: seoImage ? undefined : DEFAULT_OG_IMAGE.height,
        url: canonicalUrl,
        locale: getLocale(),
        type: 'product'
      }),
      scripts: [
        ...createProductJsonLd({
          name: productName,
          description: variantDescription || fallbackDescription,
          image: seoImage,
          sku: seoVariant?.sku_variant,
          brand: companyName,
          offers: {
            price: priceRange,
            priceCurrency: product.currency,
            availability: 'https://schema.org/InStock'
          }
        }).scripts,
        ...createBreadcrumbJsonLd([
          { name: 'Home', url: siteUrl ? `${siteUrl}/` : '/' },
          { name: 'Catalog', url: siteUrl ? `${siteUrl}/catalog` : '/catalog' },
          { name: categoryName, url: categoryUrl },
          { name: productName, url: canonicalUrl || match.pathname }
        ]).scripts
      ]
    };
  },
  component: PublicProductDetailPage,
  pendingComponent: PublicProductDetailSkeleton,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError
});
