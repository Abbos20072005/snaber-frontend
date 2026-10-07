interface PostLoginDto {
  email: string;
  password: string;
}

type Roles = 'buyer' | 'seller';

interface PostRegisterDto {
  country: string;
  email: string;
  full_name: string;
  password: string;
  role: Roles;
}

interface PostVerifyOtpDto {
  email: string;
  otp_code: string | undefined;
}

interface PostResendDto {
  email: string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
}

// Dto

type PatchAuthMeDto = Partial<{
  full_name: string;
  image: File;
  phone_number: string;
  currency: CurrencyCode;
  country: string;
}>;

interface PatchAuthMePasswordDto {
  confirm_password: string;
  new_password: string;
  old_password: string;
}

interface PostForgetPasswordDto {
  email: string;
}

interface PostForgetPasswordVerifyDto {
  confirm_password: string;
  email: string;
  new_password: string;
  otp_code: string;
}

interface PostForgetPasswordResendDto {
  email: string;
}

// OAuth

interface OAuthGoogleData {
  access: string;
  needs_setup: boolean;
  refresh: string;
  user: {
    id: number;
    full_name: string;
    email: string;
    phone_number?: string;
    role: UserRole;
    image?: string | null;
    country?: string;
    currency?: CurrencyCode;
  };
}

interface PostOAUthGoogleDto {
  code: string;
}
