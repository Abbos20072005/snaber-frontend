import { api } from '@/shared/api';

export const getSellerBuyerEngagement = () =>
  api.get<BuyerEngagement>('dashboards/sellers/buyer-engagement/');

export const getSellerHeroSummary = () => api.get<HeroSummary>('dashboards/sellers/hero-summary/');

export const getSellerKPIS = () => api.get<KPIResponse>('dashboards/sellers/kpis/');

export const getSellerRecentOrders = () =>
  api.get<RecentOrders>('dashboards/sellers/recent-orders/');

export const getSellerRevenueMomentum = () =>
  api.get<RevenueMomentum>('dashboards/sellers/revenue-momentum/');

export const getSellerRFQPipeline = () =>
  api.get<RFQPipeline>('dashboards/sellers/rfq-pipeline/');

export const getSellerSalesByCategory = () =>
  api.get<SalesByCategory>('dashboards/sellers/sales-by-category/');

export const getSellerTopProducts = () => api.get<TopProducts>('dashboards/sellers/top-products/');
