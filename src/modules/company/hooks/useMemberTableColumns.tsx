import type { ColumnDef } from '@tanstack/react-table';

import { useLingui } from '@lingui/react/macro';

import { userRoleColorMap, userRoleLabelMap } from '@/modules/users';
import { Badge } from '@/shared/ui/badge';

import { CompanyMemberActions } from '../components';

export const useMemberTableColumns = (): ColumnDef<Member>[] => {
  const { t } = useLingui();

  return [
    {
      size: 32,
      accessorKey: 'id',
      header: 'ID',
      cell: ({ row }) => row.original.user.id
    },
    {
      accessorKey: 'user.full_name',
      header: t`Full Name`,
      cell: ({ row }) => <div className='font-medium'>{row.original.user.full_name}</div>
    },
    {
      accessorKey: 'user.email',
      header: 'Email',
      cell: ({ row }) => row.original.user.email
    },
    {
      accessorKey: 'user.phone_number',
      header: t`Phone number`,
      cell: ({ row }) => row.original.user.phone_number
    },
    {
      accessorKey: 'user.role',
      header: t`Role`,
      cell: ({ row }) => (
        <Badge
          style={{
            color: userRoleColorMap[row.original.user.role],
            backgroundColor: `${userRoleColorMap[row.original.user.role]}20`
          }}
        >
          {t(userRoleLabelMap[row.original.user.role])}
        </Badge>
      )
    },
    {
      accessorKey: 'is_owner',
      header: t`Owner`,
      cell: ({ row }) => (
        <Badge variant={row.original.is_owner ? 'default' : 'outline'}>
          {row.original.is_owner ? 'Yes' : 'No'}
        </Badge>
      )
    },
    {
      id: 'actions',
      size: 32,
      cell: ({ row }) => <CompanyMemberActions row={row} />
    }
  ];
};
