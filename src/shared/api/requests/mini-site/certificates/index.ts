import { api } from '@/shared/api';

export interface GetCertificatesByCompanyRequest {
  companyId: number;
}

export const getCertificatesByCompany = ({ companyId }: GetCertificatesByCompanyRequest) =>
  api.get<CertificatesResponse>(`company/certificates/${companyId}/`);

export interface GetCertificateByIdRequest {
  id: number;
}

export const getCertificateById = ({ id }: GetCertificateByIdRequest) =>
  api.get<Certificate>(`company/certificate/${id}/`);

interface PostCertificateRequest {
  data: PostCertificateDto;
}

export const postCertificate = ({ data }: PostCertificateRequest) =>
  api.post(`company/certificate/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

interface PatchCertificateRequest {
  data: PatchCertificateDto;
  id: number;
}

export const patchCertificate = ({ id, data }: PatchCertificateRequest) =>
  api.patch(`company/certificate/${id}/`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

interface DeleteCertificateRequest {
  id: number;
}

export const deleteCertificate = ({ id }: DeleteCertificateRequest) =>
  api.delete(`company/certificate/${id}/`);
