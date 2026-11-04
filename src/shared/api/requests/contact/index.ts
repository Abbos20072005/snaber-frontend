import { apiWithoutAuth } from '@/shared/api';

interface ContactRequest {
  data: ContactDTO;
}

export const postContact = ({ data }: ContactRequest) =>
  apiWithoutAuth.post('/core/contact/', data);
