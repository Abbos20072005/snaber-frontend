import { orderStatusColorMap, orderTypeColorMap } from '@/modules/order';

import { ACTIVE_ORDER_STATUSES, ORDER_STATUSES, ORDER_TYPES } from './constants';

const getMonthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}`;

export const getOrderTotal = (order: Order) => {
  const price = Number(order.total_price || 0);
  return price * order.quantity;
};

const buildMonthBuckets = (orders: Order[]) => {
  const now = new Date();
  const buckets = Array.from({ length: 6 }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);

    return {
      key: getMonthKey(date),
      month: date.toLocaleString('en', { month: 'short' }),
      orders: 0,
      spend: 0
    };
  });

  const bucketMap = new Map(buckets.map((bucket) => [bucket.key, bucket]));

  orders.forEach((order) => {
    const createdAt = new Date(order.created_at);
    const bucket = bucketMap.get(getMonthKey(createdAt));

    if (!bucket) return;

    bucket.orders += 1;
    bucket.spend += getOrderTotal(order);
  });

  return buckets;
};

export const getBuyerDashboardData = (orders: Order[]) => {
  const totalSpend = orders.reduce((total, order) => total + getOrderTotal(order), 0);
  const activeOrders = orders.filter((order) =>
    ACTIVE_ORDER_STATUSES.includes(order.status)
  ).length;
  const rfqOrders = orders.filter((order) => order.order_type === 'rfq').length;
  const acceptedOrders = orders.filter((order) => order.status === 'accepted').length;
  const completedShare = orders.length ? Math.round((acceptedOrders / orders.length) * 100) : 0;

  const statusData = ORDER_STATUSES.map((status) => ({
    fill: orderStatusColorMap[status],
    status,
    value: orders.filter((order) => order.status === status).length
  }));

  const typeData = ORDER_TYPES.map((type) => ({
    fill: orderTypeColorMap[type],
    orders: orders.filter((order) => order.order_type === type).length,
    type
  }));

  const recentOrders = [...orders]
    .sort((first, second) => Date.parse(second.created_at) - Date.parse(first.created_at))
    .slice(0, 5);

  return {
    activeOrders,
    completedShare,
    recentOrders,
    rfqOrders,
    statusData,
    totalOrders: orders.length,
    totalSpend,
    trendData: buildMonthBuckets(orders),
    typeData
  };
};

export type BuyerDashboardData = ReturnType<typeof getBuyerDashboardData>;
