import { useSuspenseQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';

import {
  getProductRequestsQueryOptions,
  useProductRequestTableColumns
} from '@/modules/product-requests';
import { useDataTable } from '@/shared/hooks/use-data-table';
import { DataTable, DataTableToolbar } from '@/shared/ui/data-table';

export const ProductRequestsTable = () => {
  const columns = useProductRequestTableColumns();
  const params = useSearch({ from: '/admin/requests/' });

  const requestsQuery = useSuspenseQuery(getProductRequestsQueryOptions({ params }));

  const { table } = useDataTable({
    columns,
    data: requestsQuery.data.results,
    rowCount: requestsQuery.data.count,
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
