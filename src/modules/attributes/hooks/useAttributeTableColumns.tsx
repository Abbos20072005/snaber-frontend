import type { ColumnDef } from '@tanstack/react-table';

import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { EditIcon, EllipsisVerticalIcon, ListPlusIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { AttributeDialog, AttributeValueDialog } from '@/modules/attributes';
import { attributeTypeColorMap, attributeTypeLabelMap } from '@/modules/products';
import { deleteAttribute } from '@/shared/api';
import { Badge } from '@/shared/ui/badge';
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

interface UseAttributeTableColumnsProps {
  onManageValues?: (attribute: Attribute) => void;
}

export const useAttributeTableColumns = ({
  onManageValues
}: UseAttributeTableColumnsProps = {}): ColumnDef<Attribute>[] => {
  const { t } = useLingui();

  return [
    {
      header: `${t`Name`} (UZ)`,
      cell: ({ row }) => row.original.name_uz || '-'
    },
    {
      header: `${t`Name`} (EN)`,
      cell: ({ row }) => row.original.name_en || '-'
    },
    {
      header: `${t`Name`} (RU)`,
      cell: ({ row }) => row.original.name_ru || '-'
    },
    {
      id: 'category',
      header: t`Category`,
      cell: ({ row: { original } }) => {
        if (original.category)
          return (
            <Link
              params={{
                id: String(original.category.id)
              }}
              className='text-primary underline-offset-4 hover:underline'
              to='/admin/category/$id'
            >
              {original.category.name}
            </Link>
          );
        return '-';
      }
    },
    {
      accessorKey: 'attribute_type',
      header: t`Type`,
      cell: ({ row }) => (
        <Badge
          style={{
            backgroundColor: attributeTypeColorMap[row.original.attribute_type]
          }}
        >
          {t(attributeTypeLabelMap[row.original.attribute_type])}
        </Badge>
      )
    },
    {
      accessorKey: 'is_filterable',
      header: t`Filterable`,
      cell: ({ row: { original } }) => (
        <Badge variant={original.is_filterable ? 'success' : 'outline'}>
          {original.is_filterable ? t`Yes` : t`No`}
        </Badge>
      )
    },
    {
      id: 'actions',
      size: 32,
      cell: function Cell({ row }) {
        const [openEditDialog, setEditDialog] = useState(false);
        const [openCreateValueDialog, setCreateValueDialog] = useState(false);
        const [openDeleteAlert, setDeleteAlert] = useState(false);

        const deleteMutation = useMutation({
          mutationFn: deleteAttribute,
          onSuccess: () => {
            setDeleteAlert(false);
            toast.success(t`Attribute deleted successfully.`);
          },
          onError: () => toast.error(t`Failed to delete attribute.`),
          meta: {
            invalidatesQuery: ATTRIBUTES_QUERY_KEYS.all(),
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
              <DropdownMenuContent align='end' className='w-48'>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => onManageValues?.(row.original)}>
                    <ListPlusIcon />
                    {t`Manage values`}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCreateValueDialog(true)}>
                    <ListPlusIcon />
                    {t`Add value`}
                  </DropdownMenuItem>
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
            <AttributeDialog
              editValues={row.original}
              onOpenChange={setEditDialog}
              open={openEditDialog}
            />
            <AttributeValueDialog
              onOpenChange={setCreateValueDialog}
              open={openCreateValueDialog}
            />
            <DeleteAlertDialog
              itemName={row.original.name}
              title={t`Delete attribute`}
              description={t`Are you sure you want to delete this attribute? This action cannot be undone.`}
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
