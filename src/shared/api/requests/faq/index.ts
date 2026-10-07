import { api, apiWithoutAuth } from '@/shared/api';

export const getFaqs = () =>
  apiWithoutAuth.get<FaqsResponse>('/core/faq/').then(({ data }) => data);

interface DeleteFaqRequest {
  id: number;
}
export const deleteFaq = ({ id }: DeleteFaqRequest) => api.delete(`core/faq/${id}/`);

interface PostFaqRequest {
  data: FaqDTO;
}

export const postFaq = ({ data }: PostFaqRequest) => api.post('core/faq/', data);

interface PatchFaqRequest {
  data: Partial<FaqDTO>;
  id: number;
}

export const patchFaq = ({ data, id }: PatchFaqRequest) => api.patch(`core/faq/${id}/`, data);
