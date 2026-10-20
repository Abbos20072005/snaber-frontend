import { api, apiWithoutAuth } from '@/shared/api';

export interface PostOtpSendRequest {
  data: PostOtpSendDto;
}

export const postOtpSend = ({ data }: PostOtpSendRequest) =>
  apiWithoutAuth.post<ApiResponse<OtpSendResponse>>('authentication/users/otp/send/', data);

export interface PostOtpVerifyRequest {
  data: PostOtpVerifyDto;
}

export const postOtpVerify = ({ data }: PostOtpVerifyRequest) =>
  apiWithoutAuth.post<ApiResponse<TokenResponse>>('authentication/users/otp/verify/', data);

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
