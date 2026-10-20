import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeftIcon } from 'lucide-react';
import { toast } from 'sonner';

import type { ProductSchemaForm } from '@/modules/products';

import { PRODUCT_QUERY_KEYS, ProductForm, productFormToDto } from '@/modules/products';
import { postProduct, postProductImages } from '@/shared/api';
import { buttonVariants } from '@/shared/ui/button';
import { PageContent, PageHeader } from '@/shared/ui/page';

export const ProductCreate = () => {
  const { t } = useLingui();
  const navigate = useNavigate();

  const productPostMutation = useMutation({
    mutationFn: async (values: ProductSchemaForm) => {
      const { data: product } = await postProduct({ data: productFormToDto(values) });

      if (values.images.length > 0)
        await postProductImages({ id: product.id, files: values.images });

      return product;
    },
    onSuccess: (product) => {
      toast.success(t`Product created.`);
      void navigate({ to: '/admin/products/$id', params: { id: String(product.id) } });
    },
    onError: () => toast.error(t`Failed to create product.`),
    meta: {
      invalidatesQuery: [...PRODUCT_QUERY_KEYS.base()],
      withoutToastOnError: true
    }
  });

  return (
    <>
      <PageHeader className='mx-auto w-full max-w-4xl'>
        <Link className={buttonVariants({ variant: 'outline' })} to='/admin/products'>
          <ArrowLeftIcon />
          {t`Products`}
        </Link>
        <h1 className='text-primary ml-2 text-xl font-semibold'>{t`Create product`}</h1>
      </PageHeader>
      <PageContent className='mx-auto w-full max-w-4xl'>
        <ProductForm
          submitLabel={t`Create`}
          isLoading={productPostMutation.isPending}
          onSubmit={(values) => productPostMutation.mutate(values)}
        />
      </PageContent>
    </>
  );
};
