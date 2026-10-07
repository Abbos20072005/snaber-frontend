import { api, apiWithoutAuth } from '@/shared/api';

export const getAboutInfo = () =>
  apiWithoutAuth.get<AboutResponse>('core/about-us/').then(({ data }) => data);

interface PostAboutRequest {
  data: AboutDTO;
}

export const postAboutInfo = ({ data }: PostAboutRequest) => api.post('core/about-us/', data);
