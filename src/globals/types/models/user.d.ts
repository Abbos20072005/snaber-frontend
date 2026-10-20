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

type UsersResponse = Pagination<User>;

// DTO

type PatchUserDto = Partial<Omit<User, 'id'>>;
