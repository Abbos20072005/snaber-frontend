import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { postFavouriteProduct } from '@/shared/api';
import { useFavoritesStore } from '@/shared/store';

import { PRODUCT_QUERY_KEYS } from '../options';

export const useProductFavorite = (product: ProductPreview) => {
  const { t } = useLingui();
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  const isFav = isFavorite(product.id);

  const postFavoriteMutation = useMutation({
    mutationFn: postFavouriteProduct,
    meta: {
      invalidatesQuery: PRODUCT_QUERY_KEYS.getFavorites()
    }
  });

  const onToggleFavorite = () => {
    const wasFavorite = isFav;

    toggleFavorite(product);

    if (!wasFavorite) toast(t`Added to favorites`);
    postFavoriteMutation.mutate(
      { data: { product_id: product.id, is_favourite: !wasFavorite } },
      { onError: () => toggleFavorite(product) }
    );
  };

  return { isFavorite: isFav, onToggleFavorite };
};
