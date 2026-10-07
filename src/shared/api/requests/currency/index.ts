import { api } from '@/shared/api';

export const getCurrencies = () => api.get<CurrenciesResponse>('core/currencies/');
