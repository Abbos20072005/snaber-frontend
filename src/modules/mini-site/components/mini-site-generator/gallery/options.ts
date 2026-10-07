import { queryOptions } from '@tanstack/react-query';

import type { GetGalleriesCompanyRequest } from '@/shared/api';

import { getGalleriesByCompany } from '@/shared/api';

export const SITE_GALLERY_QUERY_KEYS = {
  all: () => ['site-gallery'] as const,
  getAllByCompanyId: (request: GetGalleriesCompanyRequest) =>
    [...SITE_GALLERY_QUERY_KEYS.all(), request] as const
};

export const getGalleryByCompanyIdQueryOptions = (request: GetGalleriesCompanyRequest) =>
  queryOptions({
    queryFn: () => getGalleriesByCompany(request),
    queryKey: SITE_GALLERY_QUERY_KEYS.getAllByCompanyId(request)
  });
