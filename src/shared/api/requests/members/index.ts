import { api } from '../../instance';

export interface GetAllCompanyMembers {
  params?: Partial<{
    page: number;
    page_size: number;
    search: string;
  }>;
}

export interface DeleteMember {
  id: number;
}

export const getAllMembers = (request?: GetAllCompanyMembers) =>
  api.get('company/members/', request);

export const deleteMember = (request?: DeleteMember) =>
  api.delete(`company/members/${request?.id}/`);

interface MemberCreateRequest {
  data: MemberDto;
}

export const createMember = ({ data }: MemberCreateRequest) => api.post('company/members/', data);
