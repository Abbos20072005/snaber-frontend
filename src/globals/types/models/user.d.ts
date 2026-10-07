type UserRole = 'admin' | 'buyer' | 'moderator' | 'seller' | 'super_admin';

interface User {
  block_reason: string;
  country?: string;
  currency?: CurrencyCode;
  email: string;
  full_name: string;
  id: number;
  image?: string;
  is_active: boolean;
  is_blocked: boolean;
  is_staff: boolean;
  is_verified: boolean;
  phone_number: string;
  role: UserRole;
}

type UsersResponse = Pagination<User>;

// DTO

type PatchUserDto = Partial<Omit<User, 'id'>>;
