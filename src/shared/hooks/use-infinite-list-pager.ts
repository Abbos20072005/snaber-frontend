import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface InfiniteQueryState {
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage: () => Promise<unknown>;
}

interface UseInfiniteListPagerOptions {
  enabled?: boolean;
  rootMargin?: string;
  threshold?: number;
}

export const useInfiniteListPager = (
  query?: InfiniteQueryState,
  options: UseInfiniteListPagerOptions = {}
) => {
  const { enabled = true, rootMargin = '400px 0px', threshold = 0 } = options;

  const { ref: sentinelRef, inView } = useInView({
    rootMargin,
    threshold
  });

  const hasMore = !!query?.hasNextPage;
  const isFetchingNextPage = !!query?.isFetchingNextPage;

  useEffect(() => {
    if (!enabled) return;
    if (!inView || !hasMore || isFetchingNextPage || !query) return;
    void query.fetchNextPage();
  }, [enabled, hasMore, inView, isFetchingNextPage, query]);

  return {
    hasMore,
    isFetchingNextPage,
    sentinelRef
  };
};
