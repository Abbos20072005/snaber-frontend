import type { ColumnDef } from '@tanstack/react-table';

import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { EditIcon, EllipsisVerticalIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { deleteUnitOfMeasure } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { DeleteAlertDialog } from '@/shared/ui/delete-alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';

import { UnitDialog } from '../components/UnitDialog';
import { UNIT_OF_MEASURES_QUERY_KEYS } from '../options';

export const useUnitTableColumns = (): ColumnDef<UnitOfMeasure>[] => {
  const { t } = useLingui();

  return [
    {
      accessorKey: 'unit',
      header: t`Unit`,
      cell: ({ row }) => <span className='font-medium'>{row.original.unit}</span>
    },
    {
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => <span className='font-mono text-xs'>{row.original.id}</span>
    },
    {
      id: 'actions',
      size: 32,
      cell: function Cell({ row }) {
        const [openEditDialog, setEditDialog] = useState<boolean>(false);
        const [openDeleteAlert, setDeleteAlert] = useState<boolean>(false);

        const deleteUnitMutation = useMutation({
          mutationFn: deleteUnitOfMeasure,
          onSuccess: () => {
            setDeleteAlert(false);
            toast.success(t`Unit deleted successfully.`);
          },
          onError: () => toast.error(t`Failed to delete unit.`),
          meta: {
            withoutToastOnError: true,
            invalidatesQuery: UNIT_OF_MEASURES_QUERY_KEYS.base()
          }
        });

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button aria-label={t`Actions`} size='icon' variant='ghost'>
                    <EllipsisVerticalIcon />
                  </Button>
                }
              />
              <DropdownMenuContent align='start' className='w-40'>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setEditDialog(true)}>
                    <EditIcon />
                    {t`Update`}
                  </DropdownMenuItem>
                  <DropdownMenuItem variant='destructive' onClick={() => setDeleteAlert(true)}>
                    <Trash2Icon />
                    {t`Delete`}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DeleteAlertDialog
              itemName={row.original.unit}
              title={t`Delete unit`}
              description={t`Are you sure you want to delete this unit? This action cannot be undone.`}
              isLoading={deleteUnitMutation.isPending}
              onDelete={() => deleteUnitMutation.mutate({ id: row.original.id })}
              onOpenChange={setDeleteAlert}
              open={openDeleteAlert}
            />
            <UnitDialog
              editValues={row.original}
              onOpenChange={setEditDialog}
              open={openEditDialog}
            />
          </>
        );
      }
    }
  ];
};
