import type { ColumnDef } from '@tanstack/react-table';

import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { EditIcon, EllipsisVerticalIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { UserFormDialog } from '@/modules/users/components/UserFormDialog';
import { userRoleColorMap, userRoleLabelMap, userRoleOptions } from '@/modules/users/constants';
import { USERS_QUERY_KEYS } from '@/modules/users/options';
import { deleteUser } from '@/shared/api/requests/user';
import { CURRENCY_SYMBOL } from '@/shared/constants';
import { formatLocaleDate, formatPrice } from '@/shared/lib/format';
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

export const useUserTableColumns = (): ColumnDef<UserListItem>[] => {
  const { t } = useLingui();

  return [
    {
      id: 'search',
      accessorKey: 'full_name',
      header: t`Full name`,
      cell: ({ row }) => (
        <Link
          className='text-primary font-medium hover:underline'
          params={{ id: String(row.original.id) }}
          to='/admin/users/$id'
        >
          {row.original.full_name || row.original.phone_number}
        </Link>
      ),
      meta: {
        variant: 'text',
        label: t`Search by name, email or phone`
      },
      enableColumnFilter: true
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => row.original.email || '-'
    },
    {
      accessorKey: 'phone_number',
      header: t`Phone number`
    },
    {
      id: 'role',
      accessorKey: 'role',
      header: t`Role`,
      cell: ({ row }) => {
        const role = row.original.role;

        return (
          <Badge
            style={{
              color: userRoleColorMap[role],
              backgroundColor: `${userRoleColorMap[role]}20`
            }}
          >
            {t(userRoleLabelMap[role])}
          </Badge>
        );
      },
      meta: {
        variant: 'select',
        options: userRoleOptions.map(({ value, label }) => ({
          label: t(label),
          value
        })),
        placeholder: t`Filter by role`,
        label: t`Role`
      },
      enableColumnFilter: true
    },
    {
      id: 'is_verified',
      accessorKey: 'is_verified',
      header: t`Verified`,
      cell: ({ row }) => (
        <Badge variant={row.original.is_verified ? 'default' : 'outline'}>
          {row.original.is_verified ? t`Yes` : t`No`}
        </Badge>
      ),
      meta: {
        variant: 'select',
        options: [
          { label: t`Verified`, value: 'true' },
          { label: t`Not verified`, value: 'false' }
        ],
        label: t`Verified`
      },
      enableColumnFilter: true
    },
    {
      id: 'is_active',
      accessorKey: 'is_active',
      header: t`Active`,
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? 'success' : 'secondary'}>
          {row.original.is_active ? t`Active` : t`Inactive`}
        </Badge>
      ),
      meta: {
        variant: 'select',
        options: [
          { label: t`Active`, value: 'true' },
          { label: t`Inactive`, value: 'false' }
        ],
        label: t`Active`
      },
      enableColumnFilter: true
    },
    {
      id: 'is_blocked',
      accessorKey: 'is_blocked',
      header: t`Status`,
      cell: ({ row }) => (
        <Badge variant={row.original.is_blocked ? 'destructive' : 'default'}>
          {row.original.is_blocked ? t`Blocked` : 'OK'}
        </Badge>
      ),
      meta: {
        variant: 'select',
        options: [
          { label: t`Blocked`, value: 'true' },
          { label: 'OK', value: 'false' }
        ],
        label: t`Status`
      },
      enableColumnFilter: true
    },
    {
      id: 'has_orders',
      accessorKey: 'orders_count',
      header: t`Orders`,
      meta: {
        variant: 'select',
        options: [
          { label: t`With orders`, value: 'true' },
          { label: t`Without orders`, value: 'false' }
        ],
        label: t`Orders`
      },
      enableColumnFilter: true
    },
    {
      accessorKey: 'total_spent',
      header: t`Total spent`,
      cell: ({ row }) => `${formatPrice(row.original.total_spent)} ${t(CURRENCY_SYMBOL)}`
    },
    {
      accessorKey: 'last_order_at',
      header: t`Last order`,
      cell: ({ row }) =>
        row.original.last_order_at ? formatLocaleDate(row.original.last_order_at, 'PP') : '-'
    },
    {
      id: 'actions',
      size: 32,
      cell: function Cell({ row }) {
        const [openEditDialog, setEditDialog] = useState(false);
        const [openDeleteAlert, setDeleteAlert] = useState(false);

        const deleteUserMutation = useMutation({
          mutationFn: deleteUser,
          onSuccess: () => {
            setDeleteAlert(false);
            toast.success(t`Successfully deleted.`);
          },
          onError: () => {
            toast.error(t`Failed to delete user.`);
          },
          meta: {
            invalidatesQuery: [...USERS_QUERY_KEYS.base()],
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
              title={t`Delete this user?`}
              description={t`Are you sure you want to delete this user? This action cannot be undone.`}
              isLoading={deleteUserMutation.isPending}
              onDelete={() => deleteUserMutation.mutate({ id: row.original.id })}
              onOpenChange={setDeleteAlert}
              open={openDeleteAlert}
            />
            <UserFormDialog
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
