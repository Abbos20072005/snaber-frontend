import type { ColumnDef } from '@tanstack/react-table';

import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { EditIcon, EllipsisVerticalIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { UserFormDialog } from '@/modules/users/components/UserFormDialog';
import { userRoleColorMap, userRoleLabelMap, userRoleOptions } from '@/modules/users/constants';
import { USERS_QUERY_KEYS } from '@/modules/users/options';
import { deleteUser } from '@/shared/api/requests/user';
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

export const useUserTableColumns = (): ColumnDef<User>[] => {
  const { t } = useLingui();

  return [
    {
      id: 'role',
      header: t`Full name`,
      accessorKey: 'role',
      cell: ({ row }) => <span className='font-medium'>{row.original.full_name}</span>,
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
      accessorKey: 'email',
      header: 'Email'
    },
    {
      accessorKey: 'phone_number',
      header: t`Phone number`
    },
    {
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
      }
    },
    {
      accessorKey: 'is_verified',
      header: t`Verified`,
      cell: ({ row }) => (
        <Badge variant={row.original.is_verified ? 'default' : 'outline'}>
          {row.original.is_verified ? t`Yes` : t`No`}
        </Badge>
      )
    },
    {
      accessorKey: 'is_active',
      header: t`Active`,
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? 'success' : 'secondary'}>
          {row.original.is_active ? t`Active` : t`Inactive`}
        </Badge>
      )
    },
    {
      accessorKey: 'is_blocked',
      header: t`Status`,
      cell: ({ row }) => (
        <Badge variant={row.original.is_blocked ? 'destructive' : 'default'}>
          {row.original.is_blocked ? t`Blocked` : 'OK'}
        </Badge>
      )
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
