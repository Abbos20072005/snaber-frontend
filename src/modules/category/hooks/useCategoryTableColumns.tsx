import type { ColumnDef } from '@tanstack/react-table';

import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { EditIcon, EllipsisVerticalIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { CATEGORY_QUERY_KEYS, CategoryDialog } from '@/modules/category';
import { deleteCategory } from '@/shared/api';
import useFancybox from '@/shared/hooks/useFancybox.ts';
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

export const useCategoryTableColumns = (): ColumnDef<Category>[] => {
  const { t } = useLingui();
  return [
    {
      header: `${t`Name`} (UZ)`,
      cell: function Cell({ row: { original } }) {
        const { fancyboxRef } = useFancybox();

        return (
          <div ref={fancyboxRef} className='flex items-center gap-2'>
            <a
              href={original.image}
              aria-label={original.name}
              className='size-10'
              data-caption={original.name}
              data-fancybox={`product-${original.id}`}
              onClick={(event) => event.stopPropagation()}
            >
              <img
                alt={original.name}
                className='size-full rounded-md object-cover'
                src={original.image}
              />
            </a>
            <Link
              params={{
                id: String(original.id)
              }}
              className='text-primary font-medium underline-offset-4 hover:underline'
              to='/admin/category/$id'
            >
              {original.name_uz}
            </Link>
          </div>
        );
      }
    },
    {
      header: `${t`Name`} (RU)`,
      accessorKey: 'name_ru'
    },
    {
      header: `${t`Name`} (EN)`,
      accessorKey: 'name_en'
    },
    {
      accessorKey: 'code',
      header: t`Code`
    },
    {
      header: t`Parent`,
      cell: ({ row: { original } }) =>
        original.parent ? <span className='font-medium'>{original.parent.name}</span> : '-'
    },
    {
      accessorKey: 'is_active',
      header: t`Status`,
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? 'success' : 'destructive'}>
          {row.original.is_active ? t`Active` : t`Inactive`}
        </Badge>
      )
    },
    {
      id: 'actions',
      size: 32,
      cell: function Cell({ row }) {
        const [openEditDialog, setEditDialog] = useState<boolean>(false);
        const [openDeleteAlert, setDeleteAlert] = useState<boolean>(false);

        const deleteCategoryMutation = useMutation({
          mutationFn: deleteCategory,
          onSuccess: () => {
            setDeleteAlert(false);
            toast.success(t`Category deleted successfully.`);
          },
          onError: () => toast.error(t`Failed to delete category.`),
          meta: {
            withoutToastOnError: true,
            invalidatesQuery: [...CATEGORY_QUERY_KEYS.all()]
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
                  <DropdownMenuItem
                    variant='destructive'
                    onClick={() => {
                      setDeleteAlert(true);
                    }}
                  >
                    <Trash2Icon />
                    {t`Delete`}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DeleteAlertDialog
              title={t`Delete this category?`}
              description={t`Are you sure you want to delete this category? This action cannot be undone.`}
              isLoading={deleteCategoryMutation.isPending}
              onDelete={() => deleteCategoryMutation.mutate({ id: row.original.id })}
              onOpenChange={setDeleteAlert}
              open={openDeleteAlert}
            />
            <CategoryDialog
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
