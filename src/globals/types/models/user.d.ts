type UserRole = 'admin' | 'buyer';

interface User {
  block_reason: string;
  country?: string;
  email: string | null;
  full_name: string;
  id: number;
  image?: string;
  is_active: boolean;
  is_blocked: boolean;
  is_staff: boolean;
  is_verified: boolean;
  phone_number: string | null;
  role: UserRole;
}

interface UserListItem extends User {
  created_at: string;
  last_order_at: null | string;
  orders_count: number;
  total_spent: string;
}

interface UserDetail extends UserListItem {
  average_order: number;
}

type UsersResponse = Pagination<UserListItem>;

// DTO

type PatchUserDto = Partial<Omit<User, 'id'>>;
