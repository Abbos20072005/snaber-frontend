interface Industry {
  id: number;
  name: string;
}

interface CompanyRegion {
  id: number;
  name: string;
}

interface CompanyIndustry {
  id: number;
  name: string;
}

interface CompanyFeatures {
  id: number;
  name: string;
}

interface CompanyContact {
  email: string | null;
  facebook: string | null;
  instagram: string | null;
  own_site: string | null;
  phone: string | null;
  telegram: string | null;
  whatsapp: string | null;
  youtube: string | null;
}

interface Company {
  contacts: CompanyContact;
  features: CompanyFeatures;
  id: number;
  industries: CompanyIndustry[];
  logo: string;
  member_counts?: string;
  name: string;
  order_counts?: string;
  region: CompanyRegion;
  view_count: number;
}

type SortType = 'new' | 'old';
type Status = 'active' | 'blocked' | 'draft' | 'inactive';

interface CompanyDraft extends Company {
  description_moderator: string;
  status: Status;
}

type GetAllCompanyResponse = Pagination<Company>;

type GetCompanyDraftResponse = Pagination<CompanyDraft>;

type GetAllCompanyIndustryResponse = Pagination<CompanyIndustry>;

type GetAllCompanyRegionsResonse = Pagination<CompanyRegion>;
