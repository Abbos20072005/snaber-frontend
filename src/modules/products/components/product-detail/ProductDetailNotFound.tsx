import { useLingui } from '@lingui/react/macro';

import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/shared/ui/empty';

export const ProductDetailNotFound = () => {
  const { t } = useLingui();

  return (
    <Empty className='border'>
      <EmptyHeader>
        <EmptyTitle>{t`Product not found`}</EmptyTitle>
        <EmptyDescription>
          {t`No product matches this slug. Please return to the products list and open an existing item.`}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};
