interface Member {
  company: number;
  id: number;
  is_owner: boolean;
  user: MemberUser;
}

interface MemberUser {
  email: string;
  full_name: string;
  id: number;
  phone_number: string;
  role: UserRole;
}

type GetAllMemberResponse = Pagination<Member>;
type GetMemberByIdResponse = Member;

interface MemberDto {
  email: string;
  full_name: string;
  password: string;
  phone_number: string;
}
