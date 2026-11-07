import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';

import { buttonVariants } from '@/shared/ui/button';

interface Props {
  search?: string;
}

export const ProductsNotFound = ({ search }: Props) => {
  const { t } = useLingui();

  return (
    <div className='flex min-h-[60svh] flex-1 flex-col items-center justify-center gap-3 text-center'>
      <p className='text-2xl font-medium'>{t`Data not found`}</p>
      <p className='text-muted-foreground max-w-md text-sm'>
        {t`Cannot find what you need? Send us a list or a request and we will find it for you.`}
      </p>
      <Link className={buttonVariants()} search={{ text: search }} to='/quick-order'>
        {t`Order by list`}
      </Link>
    </div>
  );
};
