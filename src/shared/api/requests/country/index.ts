import { api } from '@/shared/api';

export const getCountries = () => api.get<CountriesResponse>('core/countries/');
