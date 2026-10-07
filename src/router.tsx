import type { QueryKey } from '@tanstack/react-query';

import { t } from '@lingui/core/macro';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { createRouter as createTanStackRouter } from '@tanstack/react-router';
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query';
import { toast } from 'sonner';

import { GeneralError, NotFoundError } from '@/shared/ui/errors';

import { routeTree } from './routeTree.gen';

import 'flag-icons/css/flag-icons.min.css';

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 10 * 60 * 1000
      }
    },
    queryCache: new QueryCache({
      onError: (error: any, query) => {
        if (query.meta?.withoutToastOnError) return;
        toast.error(error.response?.data.message || t`Something went wrong!`);
      }
    }),
    mutationCache: new MutationCache({
      onError: (error: any, _variables, _context, mutation) => {
        if (mutation.meta?.withoutToastOnError) return;
        toast.error(error.response?.data.message || t`Something went wrong!`);
      },
      onSuccess: (_data, _variables, _context, mutation) => {
        if (mutation.meta?.invalidatesQuery) {
          queryClient.invalidateQueries({
            queryKey: mutation.meta.invalidatesQuery
          });
        }
      }
    })
  });

  const router = createTanStackRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultNotFoundComponent: NotFoundError,
    defaultErrorComponent: GeneralError
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient
  });

  return router;
}

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      withoutToastOnError?: boolean;
      invalidatesQuery?: QueryKey;
    };
    queryMeta: {
      withoutToastOnError?: boolean;
    };
  }
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
