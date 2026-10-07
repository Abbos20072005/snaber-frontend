import { queryOptions } from '@tanstack/react-query';

import { getFaqs } from '@/shared/api/requests/faq';
export const FAQ_QUERY_KEYS = {
  all: () => ['faqs'] as const
};

export const getFaqsOptions = () =>
  queryOptions({
    queryKey: FAQ_QUERY_KEYS.all(),
    queryFn: () => getFaqs()
  });
