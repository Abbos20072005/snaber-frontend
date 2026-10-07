import { useSuspenseQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';

import { getUsersQueryOptions, useUserTableColumns } from '@/modules/users';
import { useDataTable } from '@/shared/hooks/use-data-table';
import { DataTable, DataTableToolbar } from '@/shared/ui/data-table';

export const UsersTable = () => {
  const columns = useUserTableColumns();
  const params = useSearch({ from: '/admin/users/' });

  const usersQuery = useSuspenseQuery(
    getUsersQueryOptions({
      params
    })
  );
  const users = usersQuery.data.results;

  const { table } = useDataTable({
    columns,
    data: users,
    rowCount: usersQuery.data.count,
    getRowId: (row) => String(row.id),
    initialState: {
      columnPinning: { right: ['actions'] }
    }
  });

  return (
    <DataTable
      table={table}
      loadingOptions={{
        columnCount: table.getAllColumns().length
      }}
    >
      <DataTableToolbar table={table} />
    </DataTable>
  );
};
