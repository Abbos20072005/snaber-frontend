import { useLingui } from '@lingui/react/macro';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AwardIcon, FileTextIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  getCertificatesByCompanyIdQueryOptions,
  SITE_CERTIFICATE_QUERY_KEYS,
  SiteCertificateFormDialog
} from '@/modules/mini-site';
import { deleteCertificate } from '@/shared/api';
import { formatDate } from '@/shared/lib/format';
import { cn } from '@/shared/lib/utils';
import { Button, buttonVariants } from '@/shared/ui/button';
import { DeleteAlertDialog } from '@/shared/ui/delete-alert-dialog';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from '@/shared/ui/empty';
import { Skeleton } from '@/shared/ui/skeleton';

interface Props {
  miniSite: MiniSite;
}

export const SiteCertificateSection = ({ miniSite }: Props) => {
  const { t } = useLingui();
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
  const [editCertificate, setEditCertificate] = useState<Certificate | undefined>();
  const [deleteCertificateItem, setDeleteCertificateItem] = useState<Certificate | undefined>();
  const queryClient = useQueryClient();

  const getCertificatesQuery = useQuery(
    getCertificatesByCompanyIdQueryOptions({ companyId: miniSite.id })
  );
  const certificates = getCertificatesQuery.data?.data || [];

  const deleteCertificateMutation = useMutation({
    mutationFn: deleteCertificate,
    onSuccess: () => {
      toast.success(t`Certificate deleted successfully.`);
      void queryClient.invalidateQueries({ queryKey: SITE_CERTIFICATE_QUERY_KEYS.all() });
      setDeleteCertificateItem(undefined);
    },
    onError: () => toast.error(t`Failed to delete certificate.`)
  });

  return (
    <section className='space-y-4'>
      <div className='ring-muted flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-primary text-lg font-semibold'>{t`Certificates`}</h2>
          <p className='text-muted-foreground mt-1 text-sm'>
            {t`Add company certificates, compliance documents, and awards for buyers to review.`}
          </p>
        </div>
        <Button className='w-full sm:w-fit' type='button' onClick={() => setOpenCreateDialog(true)}>
          <PlusIcon className='size-4' />
          {t`Add certificate`}
        </Button>
      </div>
      {getCertificatesQuery.isLoading ? (
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className='ring-muted rounded-2xl bg-white p-4 shadow-sm ring-1'>
              <div className='mb-4 flex items-start justify-between gap-3'>
                <Skeleton className='size-10 rounded-xl' />
                <Skeleton className='h-8 w-20' />
              </div>
              <Skeleton className='mb-3 h-5 w-3/4' />
              <Skeleton className='h-4 w-1/2' />
            </div>
          ))}
        </div>
      ) : certificates.length ? (
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {certificates.map((certificate) => (
            <article
              key={certificate.id}
              className='ring-muted group rounded-2xl bg-white p-4 shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow-md'
            >
              <div className='mb-4 flex items-start justify-between gap-3'>
                <div className='bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl'>
                  <AwardIcon className='size-5' />
                </div>
                <div className='flex gap-1 rounded-xl bg-white p-1 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100'>
                  <Button
                    aria-label={t`Edit certificate`}
                    size='icon-sm'
                    type='button'
                    variant='default'
                    onClick={() => setEditCertificate(certificate)}
                  >
                    <PencilIcon className='size-4' />
                  </Button>
                  <Button
                    aria-label={t`Delete certificate`}
                    size='icon-sm'
                    type='button'
                    variant='destructiveOutline'
                    onClick={() => setDeleteCertificateItem(certificate)}
                  >
                    <Trash2Icon className='size-4' />
                  </Button>
                </div>
              </div>
              <h3 className='text-primary line-clamp-2 text-sm font-semibold'>
                {certificate.title || '-'}
              </h3>
              <p className='text-muted-foreground mt-2 text-sm'>
                {t`Issued at`}: {formatDate(certificate.earned_at) || '-'}
              </p>
              {certificate.file && (
                <a
                  href={certificate.file}
                  className={cn('mt-4 w-full', buttonVariants({ variant: 'outline' }))}
                  rel='noreferrer'
                  target='_blank'
                >
                  <FileTextIcon className='size-4' />
                  {t`View certificate`}
                </a>
              )}
            </article>
          ))}
        </div>
      ) : (
        <Empty className='ring-muted border bg-white py-16 shadow-sm ring-1'>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <AwardIcon />
            </EmptyMedia>
            <EmptyTitle>{t`No certificates added yet.`}</EmptyTitle>
            <EmptyDescription>
              {t`Add your first certificate so buyers can review your company credentials.`}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button type='button' onClick={() => setOpenCreateDialog(true)}>
              <PlusIcon className='size-4' />
              {t`Add certificate`}
            </Button>
          </EmptyContent>
        </Empty>
      )}
      <SiteCertificateFormDialog
        company={miniSite.id}
        onOpenChange={setOpenCreateDialog}
        open={openCreateDialog}
      />
      {editCertificate && (
        <SiteCertificateFormDialog
          editValues={editCertificate}
          company={miniSite.id}
          onOpenChange={(open) => {
            if (!open) setEditCertificate(undefined);
          }}
          open={!!editCertificate}
        />
      )}
      <DeleteAlertDialog
        itemName='certificate'
        isLoading={deleteCertificateMutation.isPending}
        onDelete={() => {
          if (deleteCertificateItem) {
            deleteCertificateMutation.mutate({ id: deleteCertificateItem.id });
          }
        }}
        onOpenChange={(open) => {
          if (!open) setDeleteCertificateItem(undefined);
        }}
        open={!!deleteCertificateItem}
      />
    </section>
  );
};
