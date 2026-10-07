import type { Row } from '@tanstack/react-table';

import { useLingui } from '@lingui/react/macro';
import { Trash2Icon } from 'lucide-react';

import { deleteMember } from '@/shared/api';
import { useConfirmAction } from '@/shared/hooks/use-confirm-action';
import { Button } from '@/shared/ui/button';
import { ConfirmDialog } from '@/shared/ui/confirm-dialog';

import { COMPANY_MEMBERS_QUERY_KEYS } from '../options';

export const CompanyMemberActions = ({ row }: { row: Row<Member> }) => {
  const { t } = useLingui();
  const { loading, open, onOpenChange, onConfirm } = useConfirmAction({
    mutationFn: () => deleteMember({ id: row.original.id }),
    successMessage: t`Member deleted`,
    invalidatesQuery: COMPANY_MEMBERS_QUERY_KEYS.base()
  });

  return (
    <>
      <Button
        disabled={row.original.is_owner}
        size='icon-sm'
        variant='destructive'
        onClick={() => onOpenChange(true)}
      >
        <Trash2Icon />
      </Button>
      <ConfirmDialog
        title={row.original.user.full_name}
        description={t`Are you sure to delete this member.`}
        loading={loading}
        onConfirm={onConfirm}
        onOpenChange={onOpenChange}
        open={open}
      />
    </>
  );
};
