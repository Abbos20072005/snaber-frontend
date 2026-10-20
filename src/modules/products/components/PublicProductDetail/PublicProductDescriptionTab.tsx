import { useLingui } from '@lingui/react/macro';

import { BackendContent } from '@/modules/about';

interface Props {
  product: PublicProduct;
}

export const PublicProductDescriptionTab = ({ product }: Props) => {
  const { t } = useLingui();

  if (!product.description)
    return <p className='text-muted-foreground text-sm'>{t`No description available.`}</p>;

  return <BackendContent html={product.description} />;
};
