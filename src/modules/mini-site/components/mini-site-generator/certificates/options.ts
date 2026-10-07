import { queryOptions } from '@tanstack/react-query';

import type { GetCertificatesByCompanyRequest } from '@/shared/api';

import { getCertificatesByCompany } from '@/shared/api';

export const SITE_CERTIFICATE_QUERY_KEYS = {
  all: () => ['site-certificate'] as const,
  getAllByCompanyId: (request: GetCertificatesByCompanyRequest) =>
    [...SITE_CERTIFICATE_QUERY_KEYS.all(), request] as const
};

export const getCertificatesByCompanyIdQueryOptions = (request: GetCertificatesByCompanyRequest) =>
  queryOptions({
    queryFn: () => getCertificatesByCompany(request),
    queryKey: SITE_CERTIFICATE_QUERY_KEYS.getAllByCompanyId(request)
  });
