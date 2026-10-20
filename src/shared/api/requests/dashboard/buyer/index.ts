import { api } from '@/shared/api';

export const getBuyerKPIs = () =>
  api.get<BuyerKPIs>('dashboards/buyers/kpis/').then(({ data }) => data);

export const getBuyerPurchaseMomentum = () =>
  api.get<PurchaseMomentum>('dashboards/buyers/purchase-momentum/').then(({ data }) => data);

export const getBuyerRecentBuyingActivity = () =>
  api
    .get<BuyerBuyingActivity>('dashboards/buyers/recent-buying-activity/')
    .then(({ data }) => data);
