import { useLingui } from '@lingui/react/macro';
import { useInfiniteQuery } from '@tanstack/react-query';
import { PlusCircleIcon } from 'lucide-react';
import { useState } from 'react';

import {
  getAllMembersInfiniteOptions,
  MemberFormDialog,
  useMemberTableColumns
} from '@/modules/company';
import { useDataTable } from '@/shared/hooks/use-data-table.ts';
import { Button } from '@/shared/ui/button';
import { DataTable } from '@/shared/ui/data-table';

export const CompanyMembersTable = () => {
  const { t } = useLingui();
  const columns = useMemberTableColumns();
  const [createDialog, setCreateDialog] = useState(false);

  const getMembersInfiniteQuery = useInfiniteQuery(getAllMembersInfiniteOptions());
  const members = getMembersInfiniteQuery.data?.pages.flatMap((item) => item.data.results) || [];

  const { table } = useDataTable({
    columns,
    data: members || [],
    rowCount: 0,
    initialState: {
      columnPinning: {
        right: ['actions']
      }
    }
  });

  return (
    <div>
      <div className='mb-2 flex justify-end'>
        <Button variant='outline' onClick={() => setCreateDialog(true)}>
          <PlusCircleIcon /> {t`Create member`}
        </Button>
      </div>
      <DataTable table={table} />
      <MemberFormDialog onOpenChange={setCreateDialog} open={createDialog} />
    </div>
  );
};
