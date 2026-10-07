const SITE_NAME = 'B2B';
const DESCRIPTION_MAX_LENGTH = 160;

export const DEFAULT_OG_IMAGE = {
  height: 941,
  url: '/images/hero/industrial-marketplace-hero.png',
  width: 1672
};

const LOCALE_MAP: Record<string, string> = {
  uz: 'uz_UZ',
  ru: 'ru_RU',
  en: 'en_US'
};

interface SeoMetaOptions {
  description: string;
  image?: string | null;
  imageHeight?: number;
  imageWidth?: number;
  locale?: string;
  nofollow?: boolean;
  noindex?: boolean;
  siteName?: string;
  title: string;
  twitterCreator?: string;
  twitterSite?: string;
  type?: string;
  url?: string;
}

const normalizeDescription = (value: string) =>
  value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const truncateSeoDescription = (value: string, maxLength = DESCRIPTION_MAX_LENGTH) => {
  const normalizedValue = normalizeDescription(value);

  if (normalizedValue.length <= maxLength) return normalizedValue;

  return `${normalizedValue.slice(0, maxLength - 1).trim()}...`;
};

export const formatSeoTitle = (title: string) => `${title} | ${SITE_NAME}`;

export const createSeoMeta = ({
  description,
  image,
  imageHeight,
  imageWidth,
  locale,
  nofollow,
  noindex,
  siteName,
  title,
  twitterCreator,
  twitterSite,
  type = 'website',
  url
}: SeoMetaOptions) => {
  const formattedTitle = formatSeoTitle(title);
  const formattedDescription = truncateSeoDescription(description);

  const meta: Record<string, string>[] = [
    { title: formattedTitle },
    { name: 'description', content: formattedDescription },
    { property: 'og:title', content: formattedTitle },
    { property: 'og:description', content: formattedDescription },
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: siteName || SITE_NAME },
    { name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' },
    { name: 'twitter:title', content: formattedTitle },
    { name: 'twitter:description', content: formattedDescription }
  ];

  const links: Record<string, string>[] = [];

  if (url) {
    meta.push({ property: 'og:url', content: url }, { name: 'twitter:url', content: url });
    links.push({ rel: 'canonical', href: url });
  }

  if (locale) meta.push({ property: 'og:locale', content: LOCALE_MAP[locale] || locale });

  if (image) {
    meta.push({ property: 'og:image', content: image }, { name: 'twitter:image', content: image });

    if (imageWidth) meta.push({ property: 'og:image:width', content: String(imageWidth) });
    if (imageHeight) meta.push({ property: 'og:image:height', content: String(imageHeight) });
  }

  if (twitterSite) meta.push({ name: 'twitter:site', content: twitterSite });

  if (twitterCreator) meta.push({ name: 'twitter:creator', content: twitterCreator });

  if (noindex || nofollow) {
    const robots = [noindex ? 'noindex' : 'index', nofollow ? 'nofollow' : 'follow'].join(', ');

    meta.push({ name: 'robots', content: robots });
  }

  return { meta, links };
};

// --- JSON-LD helpers ---

export const createJsonLdScript = (data: Record<string, unknown>) => ({
  type: 'application/ld+json' as const,
  children: JSON.stringify(data)
});

interface WebsiteJsonLdOptions {
  description?: string;
  name: string;
  searchUrl?: string;
  url: string;
}

export const createWebsiteJsonLd = ({
  description,
  name,
  searchUrl,
  url
}: WebsiteJsonLdOptions) => {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url
  };

  if (description) schema.description = description;

  if (searchUrl) {
    schema.potentialAction = {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${searchUrl}{search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    };
  }

  return { scripts: [createJsonLdScript(schema)] };
};

interface OrganizationJsonLdOptions {
  description?: string;
  logo?: string;
  name: string;
  url?: string;
}

export const createOrganizationJsonLd = ({
  description,
  logo,
  name,
  url
}: OrganizationJsonLdOptions) => {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name
  };

  if (url) schema.url = url;
  if (logo) schema.logo = logo;
  if (description) schema.description = description;

  return { scripts: [createJsonLdScript(schema)] };
};

interface ProductJsonLdOffer {
  availability?: string;
  price: string;
  priceCurrency: string;
}

interface ProductJsonLdOptions {
  brand?: string;
  description: string;
  image?: string;
  name: string;
  offers?: ProductJsonLdOffer;
  sku?: string;
}

export const createProductJsonLd = ({
  brand,
  description,
  image,
  name,
  offers,
  sku
}: ProductJsonLdOptions) => {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    description,
    name
  };

  if (image) schema.image = image;
  if (sku) schema.sku = sku;
  if (brand) schema.brand = { '@type': 'Brand', name: brand };

  if (offers) {
    schema.offers = {
      '@type': 'Offer',
      price: offers.price,
      priceCurrency: offers.priceCurrency,
      ...(offers.availability && { availability: offers.availability })
    };
  }

  return { scripts: [createJsonLdScript(schema)] };
};

interface BreadcrumbJsonLdItem {
  name: string;
  url: string;
}

export const createBreadcrumbJsonLd = (items: BreadcrumbJsonLdItem[]) => {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      name: item.name,
      item: item.url,
      position: index + 1
    }))
  };

  return { scripts: [createJsonLdScript(schema)] };
};
