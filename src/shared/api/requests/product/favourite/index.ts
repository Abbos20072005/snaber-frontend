import { api } from '@/shared/api';

export const getFavouriteProducts = () =>
  api.get<FavoritesResponse>('product/favourite/').then(({ data }) => data);

interface PostFavouriteProductRequest {
  data: {
    product_id: number;
    is_favourite: boolean;
  };
}

export const postFavouriteProduct = ({ data }: PostFavouriteProductRequest) =>
  api.post<FavoriteResponse>('product/favourite/', data);
