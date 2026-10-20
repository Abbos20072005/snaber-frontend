import { api, apiWithoutAuth } from '@/shared/api';

export const getLegalInfo = () =>
  apiWithoutAuth.get<LegalResponse>('core/legal-info/').then(({ data }) => data);

interface PostLegalRequest {
  data: LegalDTO;
}

export const postLegalInfo = ({ data }: PostLegalRequest) => api.post('core/legal-info/', data);
