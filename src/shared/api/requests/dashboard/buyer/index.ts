import { api } from '@/shared/api';

export const getBuyerKPIs = () =>
  api.get<BuyerKPIs>('dashboards/buyers/kpis/').then(({ data }) => data);

export const getBuyerOrderTypeSplit = () =>
  api.get<OrderTypeSplit>('dashboards/buyers/order-type-split/').then(({ data }) => data);

export const getBuyerPurchaseMomentum = () =>
  api.get<PurchaseMomentum>('dashboards/buyers/purchase-momentum/').then(({ data }) => data);

export const getBuyerRecentBuyingActivity = () =>
  api
    .get<BuyerBuyingActivity>('dashboards/buyers/recent-buying-activity/')
    .then(({ data }) => data);

export const getBuyerStatusMix = () =>
  api.get<StatusMix>('dashboards/buyers/status-mix/').then(({ data }) => data);

export const getBuyerSummary = () =>
  api.get<BuyerSummary>('dashboards/buyers/summary/').then(({ data }) => data);
