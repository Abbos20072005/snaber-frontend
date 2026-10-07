import { api, apiWithoutAuth } from '@/shared/api';

export interface LoginRequest {
  data: PostLoginDto;
}

export const postLogin = ({ data }: LoginRequest) =>
  apiWithoutAuth.post<ApiResponse<TokenResponse>>('authentication/users/login/', data);

export interface RegisterRequest {
  data: PostRegisterDto;
}
export const postRegister = ({ data }: RegisterRequest) =>
  apiWithoutAuth.post('authentication/users/register/', data);

export interface PostVerifyOtpRequest {
  data: PostVerifyOtpDto;
}

export const postVerifyOtp = ({ data }: PostVerifyOtpRequest) =>
  apiWithoutAuth.post<ApiResponse<TokenResponse>>('authentication/users/otp/verify/', data);

export interface PostResendRequest {
  data: PostResendDto;
}

export const postOtpResend = ({ data }: PostResendRequest) =>
  apiWithoutAuth.post(`authentication/users/otp/resend/`, data);

export const getAuthMe = () => api.get<User>('authentication/users/me/').then((res) => res.data);

interface PatchAuthMeRequest {
  data: FormData | PatchAuthMeDto;
}

export const patchAuthMe = ({ data }: PatchAuthMeRequest) =>
  api.patch('authentication/users/update/', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

interface PatchAuthMePasswordRequest {
  data: PatchAuthMePasswordDto;
}

export const patchAuthMePassword = ({ data }: PatchAuthMePasswordRequest) =>
  api.patch('authentication/users/update/password/', data);

// Forget password

interface PostForgetPasswordRequest {
  data: PostForgetPasswordDto;
}

export const postForgetPassword = ({ data }: PostForgetPasswordRequest) =>
  apiWithoutAuth.post('authentication/users/forget-password/', data);

interface PostForgetPasswordVerifyRequest {
  data: PostForgetPasswordVerifyDto;
}

export const postForgetPasswordVerify = ({ data }: PostForgetPasswordVerifyRequest) =>
  apiWithoutAuth.post('authentication/users/forget-password/verify/', data);

interface PostForgetPasswordResendRequest {
  data: PostForgetPasswordResendDto;
}

export const postForgetPasswordResend = ({ data }: PostForgetPasswordResendRequest) =>
  apiWithoutAuth.post('authentication/users/forget-password/resend/', data);

// OAuth

interface PostOAuthGoogleRequest {
  data: PostOAUthGoogleDto;
}

export const postOAuthGoogle = ({ data }: PostOAuthGoogleRequest) =>
  apiWithoutAuth.post<OAuthGoogleData>('authentication/users/oauth/google/', data);
