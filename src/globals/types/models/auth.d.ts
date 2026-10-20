interface PostOtpSendDto {
  phone_number: string;
}

interface PostOtpVerifyDto {
  otp_code: string;
  phone_number: string;
}

interface OtpSendResponse {
  expires_in: number;
  resend_after: number;
}

interface TokenResponse {
  access_token: string;
  is_new_user?: boolean;
  refresh_token: string;
}

// Dto

type PatchAuthMeDto = Partial<{
  full_name: string;
  image: File;
  country: string;
}>;
