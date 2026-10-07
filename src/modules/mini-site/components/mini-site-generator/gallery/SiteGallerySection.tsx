import { useLingui } from '@lingui/react/macro';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ImageIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  getGalleryByCompanyIdQueryOptions,
  SITE_GALLERY_QUERY_KEYS,
  SiteGalleryFormDialog
} from '@/modules/mini-site';
import { deleteGallery } from '@/shared/api';
import useFancybox from '@/shared/hooks/useFancybox';
import { Button } from '@/shared/ui/button';
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

export const SiteGallerySection = ({ miniSite }: Props) => {
  const { t } = useLingui();
  const [openCreateDialog, setOpenCreateDialog] = useState<boolean>(false);
  const [editGallery, setEditGallery] = useState<Gallery | undefined>();
  const [deleteGalleryItem, setDeleteGalleryItem] = useState<Gallery | undefined>();
  const queryClient = useQueryClient();
  const { fancyboxRef } = useFancybox();

  const getGalleryQuery = useQuery(getGalleryByCompanyIdQueryOptions({ companyId: miniSite.id }));
  const galleries = getGalleryQuery.data?.data || [];

  const deleteGalleryMutation = useMutation({
    mutationFn: deleteGallery,
    onSuccess: () => {
      toast.success(t`Gallery deleted successfully.`);
      void queryClient.invalidateQueries({ queryKey: SITE_GALLERY_QUERY_KEYS.all() });
      setDeleteGalleryItem(undefined);
    },
    onError: () => toast.error(t`Failed to delete gallery.`)
  });

  return (
    <section className='space-y-4'>
      <div className='ring-muted flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2 className='text-primary text-lg font-semibold'>{t`Factory photos`}</h2>
          <p className='text-muted-foreground mt-1 text-sm'>
            {t`Add photos that represent your company, production, and workspace.`}
          </p>
        </div>
        <Button className='w-full sm:w-fit' type='button' onClick={() => setOpenCreateDialog(true)}>
          <PlusIcon className='size-4' />
          {t`Add photo`}
        </Button>
      </div>
      {getGalleryQuery.isLoading ? (
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className='ring-muted overflow-hidden rounded-2xl bg-white shadow-sm ring-1'
            >
              <Skeleton className='aspect-4/3 rounded-none' />
              <div className='space-y-3 p-4'>
                <Skeleton className='h-4 w-3/4' />
                <Skeleton className='h-8 w-full' />
              </div>
            </div>
          ))}
        </div>
      ) : galleries.length ? (
        <div ref={fancyboxRef} className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
          {galleries.map((gallery) => (
            <article
              key={gallery.id}
              className='ring-muted group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow-md'
            >
              <div className='bg-muted relative aspect-4/3 overflow-hidden'>
                <a
                  href={gallery.image}
                  aria-label={gallery.title || gallery.title_en || t`Gallery photo`}
                  className='block size-full'
                  data-caption={gallery.title || gallery.title_en || gallery.title_ru}
                  data-fancybox='site-gallery'
                >
                  <img
                    alt={gallery.title || gallery.title_en || t`Gallery photo`}
                    className='size-full object-cover transition duration-300 group-hover:scale-105'
                    src={gallery.image}
                  />
                </a>
                <div className='absolute top-3 right-3 flex gap-1 rounded-xl bg-white/40 p-1 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100'>
                  <Button
                    aria-label={t`Edit gallery`}
                    size='icon-sm'
                    type='button'
                    variant='default'
                    onClick={() => setEditGallery(gallery)}
                  >
                    <PencilIcon className='size-4' />
                  </Button>
                  <Button
                    aria-label={t`Delete gallery`}
                    size='icon-sm'
                    type='button'
                    variant='destructiveOutline'
                    onClick={() => setDeleteGalleryItem(gallery)}
                  >
                    <Trash2Icon className='size-4' />
                  </Button>
                </div>
              </div>
              <div className='text-primary w-full p-4 text-sm font-semibold'>
                <p className='truncate'>{`Uz: ${gallery.title_uz || '-'}`}</p>
                <p className='truncate'>{`Ru: ${gallery.title_ru || '-'}`}</p>
                <p className='truncate'>{`En: ${gallery.title_en || '-'}`}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty className='ring-muted border bg-white py-16 shadow-sm ring-1'>
          <EmptyHeader>
            <EmptyMedia variant='icon'>
              <ImageIcon />
            </EmptyMedia>
            <EmptyTitle>{t`No gallery photos yet`}</EmptyTitle>
            <EmptyDescription>
              {t`Add your first company photo to show buyers your production and workspace.`}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button type='button' onClick={() => setOpenCreateDialog(true)}>
              <PlusIcon className='size-4' />
              {t`Add photo`}
            </Button>
          </EmptyContent>
        </Empty>
      )}
      <SiteGalleryFormDialog
        company={miniSite.id}
        onOpenChange={setOpenCreateDialog}
        open={openCreateDialog}
      />
      {editGallery && (
        <SiteGalleryFormDialog
          editValues={editGallery}
          company={miniSite.id}
          onOpenChange={(open) => {
            if (!open) setEditGallery(undefined);
          }}
          open={!!editGallery}
        />
      )}
      <DeleteAlertDialog
        itemName='gallery photo'
        isLoading={deleteGalleryMutation.isPending}
        onDelete={() => {
          if (deleteGalleryItem) deleteGalleryMutation.mutate({ id: deleteGalleryItem.id });
        }}
        onOpenChange={(open) => {
          if (!open) setDeleteGalleryItem(undefined);
        }}
        open={!!deleteGalleryItem}
      />
    </section>
  );
};
