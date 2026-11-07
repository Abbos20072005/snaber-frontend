import { api } from '@/shared/api';

interface PostQuickOrderMatchRequest {
  data: FormData;
}

export const postQuickOrderMatch = ({ data }: PostQuickOrderMatchRequest) =>
  api.post<QuickOrderLine[]>('product/public/match/', data);
