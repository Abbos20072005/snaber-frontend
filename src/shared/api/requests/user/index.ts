import { api } from '@/shared/api';

export interface GetUsersRequest {
  params?: {
    role?: UserRole;
    page?: number;
    page_size?: number;
  };
}

export const getUsers = (request?: GetUsersRequest) =>
  api.get<UsersResponse>('authentication/users/', request);

export interface GetUserByIdRequest {
  id: number;
}

export const getUserById = ({ id }: GetUserByIdRequest) =>
  api.get<User>(`authentication/users/${id}/`);

interface PatchUsersRequest {
  data: PatchUserDto;
  id: number;
}

export const patchUser = ({ data, id }: PatchUsersRequest) =>
  api.patch<User>(`authentication/users/${id}/`, data);

interface DeleteUserRequest {
  id: number;
}

export const deleteUser = ({ id }: DeleteUserRequest) =>
  api.delete<User>(`authentication/users/${id}/`);
