import { apiWithoutAuth } from '../../instance';

export const getMainStatistics = () =>
  apiWithoutAuth.get<MainStatisticsResponse>('/company/statistics/');
