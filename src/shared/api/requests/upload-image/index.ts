import { api } from '../../instance';

export const uploadBlogImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('image', file);

  const { data } = await api.post('core/about-us/image/', formData);

  return data.image;
};
