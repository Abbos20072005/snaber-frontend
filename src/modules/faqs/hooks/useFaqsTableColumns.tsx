import type { ColumnDef } from '@tanstack/react-table';

import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { EditIcon, EyeIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { deleteFaq } from '@/shared/api/requests/faq';
import { Button } from '@/shared/ui/button.tsx';
import { DeleteAlertDialog } from '@/shared/ui/delete-alert-dialog';

import { FaqDialog } from '../components/FaqDialog';
import { FaqsDetailDialog } from '../components/FaqsDetailDialog';
import { FAQ_QUERY_KEYS } from '../options';

export const useFaqsTableColumns = (): ColumnDef<Faq>[] => {
  const { t } = useLingui();

  return [
    {
      header: 'ID',
      size: 32,
      cell: ({ row }) => <span>{row.index + 1}</span>
    },
    {
      header: `${t`Question`}`,
      accessorKey: 'name'
    },
    {
      header: `${t`Answer`}`,
      accessorKey: 'description'
    },
    {
      id: 'actions',
      size: 32,
      cell: function Cell({ row }) {
        const [openEditDialog, setEditDialog] = useState<boolean>(false);
        const [openDeleteAlert, setDeleteAlert] = useState<boolean>(false);
        const [openDetail, setOpenDetail] = useState<boolean>(false);

        const deleteFaqMutation = useMutation({
          mutationFn: deleteFaq,
          onSuccess: () => {
            setDeleteAlert(false);
            toast.success(t`FAQ deleted successfully.`);
          },
          onError: () => toast.error(t`Failed to delete FAQ.`),
          meta: {
            withoutToastOnError: true,
            invalidatesQuery: [...FAQ_QUERY_KEYS.all()]
          }
        });

        return (
          <>
            <div className='flex items-center gap-4'>
              <Button
                className='cursor-pointer'
                size={'icon-sm'}
                variant={'secondary'}
                onClick={() => setOpenDetail(true)}
              >
                <EyeIcon />
              </Button>
              <Button
                className='cursor-pointer'
                size={'icon-sm'}
                variant={'outline'}
                onClick={() => setEditDialog(true)}
              >
                <EditIcon />
              </Button>
              <Button
                className='cursor-pointer'
                size={'icon-sm'}
                variant={'destructive'}
                onClick={() => {
                  setDeleteAlert(true);
                }}
              >
                <Trash2Icon />
              </Button>
            </div>
            <FaqsDetailDialog
              data={row.original}
              setOpenDetail={setOpenDetail}
              openDetail={openDetail}
              setEditDialog={setEditDialog}
            />
            <FaqDialog
              defaultValues={row.original}
              editValues={row.original}
              onOpenChange={setEditDialog}
              open={openEditDialog}
            />
            <DeleteAlertDialog
              title={t`Delete this FAQ?`}
              description={t`Are you sure you want to delete this FAQ? This action cannot be undone.`}
              isLoading={deleteFaqMutation.isPending}
              onDelete={() => deleteFaqMutation.mutate({ id: row.original.id })}
              onOpenChange={setDeleteAlert}
              open={openDeleteAlert}
            />
          </>
        );
      }
    }
  ];
};
