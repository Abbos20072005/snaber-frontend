import type { QueryClient } from '@tanstack/react-query';

import { i18n } from '@lingui/core';
import { I18nProvider } from '@lingui/react';
import { createRootRouteWithContext, HeadContent, Scripts } from '@tanstack/react-router';
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router';
import { Toaster } from 'sonner';

import { dynamicActivate, getLocale } from '@/shared/i18n';
import { createJsonLdScript, createWebsiteJsonLd } from '@/shared/lib/seo';
import { TooltipProvider } from '@/shared/ui/tooltip';

import appCss from '../styles.css?url';

void dynamicActivate();

const SITE_URL = import.meta.env.VITE_SITE_URL || '';

const RootDocument = ({ children }: { children: React.ReactNode }) => (
  <html lang={getLocale()}>
    <head>
      <HeadContent />
    </head>
    <body suppressHydrationWarning>
      <I18nProvider i18n={i18n}>
        <NuqsAdapter>
          <TooltipProvider>{children}</TooltipProvider>
        </NuqsAdapter>
      </I18nProvider>
      <Toaster position='top-center' />
      <Scripts />
    </body>
  </html>
);

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: async () => await dynamicActivate(),
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'snaber.uz' },
      {
        name: 'description',
        content:
          'snaber.uz — marketplace for building materials and tools: cement, bricks, steel, lumber, roofing, paints, plumbing and electrical goods.'
      },
      { property: 'og:title', content: 'snaber.uz' },
      {
        property: 'og:description',
        content:
          'snaber.uz — marketplace for building materials and tools: cement, bricks, steel, lumber, roofing, paints, plumbing and electrical goods.'
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'snaber.uz' },
      { property: 'og:url', content: SITE_URL },
      { name: 'twitter:card', content: 'summary' },
      { name: 'twitter:title', content: 'snaber.uz' },
      {
        name: 'twitter:description',
        content:
          'snaber.uz — marketplace for building materials and tools: cement, bricks, steel, lumber, roofing, paints, plumbing and electrical goods.'
      }
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      ...(SITE_URL ? [{ rel: 'canonical', href: SITE_URL }] : [])
    ],
    scripts: [
      ...createWebsiteJsonLd({
        url: SITE_URL || 'https://snaber.uz',
        name: 'snaber.uz',
        description:
          'snaber.uz — marketplace for building materials and tools: cement, bricks, steel, lumber, roofing, paints, plumbing and electrical goods.',
        searchUrl: SITE_URL ? `${SITE_URL}/products?search=` : undefined
      }).scripts,
      createJsonLdScript({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'snaber.uz',
        url: SITE_URL || 'https://snaber.uz'
      })
    ]
  }),
  shellComponent: RootDocument
});
