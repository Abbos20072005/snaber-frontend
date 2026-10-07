import { useQueries } from '@tanstack/react-query';

import { api } from '@/shared/api';

interface Props {
  enabled?: boolean;
  links: (string | undefined)[];
}

export const useFileFetcher = ({ links, enabled = true }: Props) => {
  const queries = useQueries({
    queries: links.map((link) => ({
      queryKey: ['image', link],
      queryFn: async () => {
        if (!link || !enabled) return;

        const res = await api.get(link, {
          responseType: 'blob'
        });

        const blob = res.data;
        const name = link.split('/').pop() || 'image.jpg';

        return new File([blob], name, {
          type: blob.type
        });
      },
      enabled: Boolean(link) && enabled
    }))
  });

  const files = queries
    .filter((q) => q.isEnabled)
    .map((q) => q.data)
    .filter(Boolean) as File[];

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  return {
    files: files || [],
    isLoading,
    isError,
    queries
  };
};
