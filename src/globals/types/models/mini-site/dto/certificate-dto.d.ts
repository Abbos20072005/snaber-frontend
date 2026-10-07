interface CertificateDto {
  company: number;
  earned_at: string;
  file: File;
  title: string;
}

type PostCertificateDto = CertificateDto;
type PatchCertificateDto = Partial<CertificateDto>;
