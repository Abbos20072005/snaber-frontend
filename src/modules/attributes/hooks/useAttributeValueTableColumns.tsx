import type { ColumnDef } from '@tanstack/react-table';

import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { EditIcon, EllipsisVerticalIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { AttributeValueDialog } from '@/modules/attributes';
import { deleteAttributeValue } from '@/shared/api';
import useFancybox from '@/shared/hooks/useFancybox';
import { Button } from '@/shared/ui/button';
import { DeleteAlertDialog } from '@/shared/ui/delete-alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';

import { ATTRIBUTES_QUERY_KEYS } from '../options';

export const useAttributeValueTableColumns = (): ColumnDef<AttributeValue>[] => {
  const { t } = useLingui();

  return [
    {
      accessorKey: 'image',
      header: t`Image`,
      cell: function Cell({ row }) {
        const { fancyboxRef } = useFancybox();
        const { image, value } = row.original;

        if (!image) return '-';

        return (
          <div ref={fancyboxRef}>
            <a
              href={image}
              aria-label={value}
              className='block size-10'
              data-caption={value}
              data-fancybox={`attribute-value-${row.original.id}`}
              onClick={(event) => event.stopPropagation()}
            >
              <img alt={value} className='size-full rounded-md border object-cover' src={image} />
            </a>
          </div>
        );
      }
    },
    {
      accessorKey: 'value_uz',
      header: `${t`Value`} (UZ)`,
      cell: ({ row }) => row.original.value_uz || '-'
    },
    {
      accessorKey: 'value_en',
      header: `${t`Value`} (EN)`,
      cell: ({ row }) => row.original.value_en || '-'
    },
    {
      accessorKey: 'value_ru',
      header: `${t`Value`} (RU)`,
      cell: ({ row }) => row.original.value_ru || '-'
    },
    {
      id: 'attribute',
      header: t`Attribute`,
      cell: ({ row }) => row.original.attribute.name
    },
    {
      id: 'actions',
      size: 32,
      cell: function Cell({ row }) {
        const [openEditDialog, setEditDialog] = useState(false);
        const [openDeleteAlert, setDeleteAlert] = useState(false);

        const deleteMutation = useMutation({
          mutationFn: deleteAttributeValue,
          onSuccess: () => {
            setDeleteAlert(false);
            toast.success(t`Value deleted successfully.`);
          },
          onError: () => toast.error(t`Failed to delete value.`),
          meta: {
            invalidatesQuery: ATTRIBUTES_QUERY_KEYS.values(),
            withoutToastOnError: true
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
              <DropdownMenuContent align='end' className='w-40'>
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
            <AttributeValueDialog
              editValues={row.original}
              onOpenChange={setEditDialog}
              open={openEditDialog}
            />
            <DeleteAlertDialog
              itemName={row.original.value}
              title={t`Delete value`}
              description={t`Are you sure you want to delete this value? This action cannot be undone.`}
              isLoading={deleteMutation.isPending}
              onDelete={() => deleteMutation.mutate({ id: row.original.id })}
              onOpenChange={setDeleteAlert}
              open={openDeleteAlert}
            />
          </>
        );
      }
    }
  ];
};
