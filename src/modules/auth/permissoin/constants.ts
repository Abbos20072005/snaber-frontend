export type HAS_ACCESS = 'user_detail';

export const hasAccessMap: Record<HAS_ACCESS, UserRole[]> = {
  user_detail: ['admin']
};
