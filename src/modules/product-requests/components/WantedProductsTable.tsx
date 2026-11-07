import { useSuspenseQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';

import {
  getWantedProductsQueryOptions,
  useWantedProductTableColumns
} from '@/modules/product-requests';
import { useDataTable } from '@/shared/hooks/use-data-table';
import { DataTable, DataTableToolbar } from '@/shared/ui/data-table';

export const WantedProductsTable = () => {
  const columns = useWantedProductTableColumns();
  const params = useSearch({ from: '/admin/requests/wanted' });

  const wantedQuery = useSuspenseQuery(getWantedProductsQueryOptions({ params }));

  const { table } = useDataTable({
    columns,
    data: wantedQuery.data.results,
    rowCount: wantedQuery.data.count,
    getRowId: (row) => row.name
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
