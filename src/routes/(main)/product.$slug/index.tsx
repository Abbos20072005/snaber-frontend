import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link, useParams } from '@tanstack/react-router';
import { useState } from 'react';
// FEATURE DISABLED: Product comments (auth-gated).
// import { Suspense } from 'react';

// import { ProductCommentSection, ProductCommentSectionSkeleton } from '@/modules/comment';
import {
  getGallery,
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
  const gallery = getGallery(product);

  const handleShowAllCharacteristics = () => {
    setActiveTab('characteristics');
    document
      .getElementById('product-full-characteristics')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

      <div className='grid items-start gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_340px]'>
        <PublicProductGallery
          activeImageSrc={activeImageSrc}
          gallery={gallery}
          onActiveImageChange={setActiveImageSrc}
        />
        <PublicProductSummary onShowAll={handleShowAllCharacteristics} product={product} />
        <PublicProductAside product={product} />
      </div>

      <div className='space-y-6'>
        {/* FEATURE DISABLED: Product comments (auth-gated). */}
        {/* <Suspense fallback={<ProductCommentSectionSkeleton />}> */}
        {/*   <ProductCommentSection currentProduct={product} /> */}
        {/* </Suspense> */}
        <PublicProductTabs activeTab={activeTab} onTabChange={setActiveTab} product={product} />
      </div>
    </div>
  );
};

export const Route = createFileRoute('/(main)/product/$slug/')({
  loader: ({ context: { queryClient }, params: { slug } }) => {
    const id = extractSlugId(slug);

    return queryClient.ensureQueryData(getPublicProductByIdQueryOptions({ id }));
  },
  head: ({ loaderData: product, match }) => {
    const siteUrl = import.meta.env.VITE_SITE_URL || '';

    if (!product) {
      return {
        ...createSeoMeta({
          title: 'Product details',
          description: 'View product details, prices and availability on snaber.uz.',
          locale: getLocale()
        })
      };
    }

    const productName = product.name;
    const categoryName = product.category.name;
    const description =
      product.specifications.map(({ name, value }) => `${name}: ${value}`).join(', ') ||
      `Buy ${productName} in ${categoryName} on snaber.uz — building materials and tools.`;
    const seoImage = getGallery(product)[0]?.src;
    const canonicalUrl = siteUrl ? `${siteUrl}${match.pathname}` : undefined;
    const categoryUrl = `${siteUrl}/catalog/${generateSlugId(product.category.id, categoryName)}`;

    return {
      ...createSeoMeta({
        title: productName,
        description,
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
          description,
          image: seoImage,
          sku: product.sku,
          offers: {
            price: formatPrice(product.final_price),
            priceCurrency: 'UZS',
            availability:
              product.stock_quantity > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock'
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
