import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeftIcon, BoxesIcon } from 'lucide-react';
import { toast } from 'sonner';

import type { ProductSchemaForm } from '@/modules/products';

import { PRODUCT_QUERY_KEYS, ProductForm, productFormToDto } from '@/modules/products';
import { postProduct } from '@/shared/api';
import { buttonVariants } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { PageContent, PageHeader } from '@/shared/ui/page';

interface Props {
  url: '/admin/product-checks' | '/seller/product-checks';
}

export const ProductCreate = ({ url }: Props) => {
  const { t } = useLingui();
  const navigate = useNavigate();

  const productPostMutation = useMutation({
    mutationFn: postProduct,
    onSuccess: ({ data: product }) => {
      toast.success(t`Base product created.`);
      void navigate({
        to:
          url === '/admin/product-checks'
            ? '/admin/product-checks/$id'
            : '/seller/product-checks/$id',
        params: {
          id: String(product.id)
        }
      });
    },
    onError: () => toast.error(t`Failed to create product.`),
    meta: {
      invalidatesQuery: [...PRODUCT_QUERY_KEYS.base()],
      withoutToastOnError: true
    }
  });

  const onSubmit = (values: ProductSchemaForm) => {
    productPostMutation.mutate({
      data: productFormToDto(values)
    });
  };
  return (
    <>
      <PageHeader className='h-fit flex-col items-start pt-4'>
        <Link className={buttonVariants({ variant: 'secondary' })} to={url}>
          <ArrowLeftIcon />
          {t`Product checks`}
        </Link>
        <div className='grid gap-2'>
          <div className='flex items-center gap-3'>
            <div className='bg-primary/10 text-primary grid size-10 place-items-center rounded-md'>
              <BoxesIcon className='size-5' />
            </div>
            <div>
              <h1 className='font-heading text-2xl font-semibold'>{t`Create product`}</h1>
              <p className='text-muted-foreground text-sm'>
                {t`Start with the base product data, then continue to variants and characteristics.`}
              </p>
            </div>
          </div>
        </div>
      </PageHeader>
      <PageContent>
        <Card>
          <CardHeader>
            <CardTitle>{t`Base fields`}</CardTitle>
            <CardDescription>{t`Identity, category, pricing, MOQ and lead time.`}</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm
              submitLabel={t`Create`}
              isLoading={productPostMutation.isPending}
              onSubmit={onSubmit}
            />
          </CardContent>
        </Card>
      </PageContent>
    </>
  );
};
