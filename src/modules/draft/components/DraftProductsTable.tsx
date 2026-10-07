import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';

import { useDraftProductTableColumns } from '@/modules/draft';
import { getDraftProductsQueryOptions } from '@/modules/products';
import { useDataTable } from '@/shared/hooks/use-data-table';
import { DataTable, DataTableToolbar } from '@/shared/ui/data-table';

interface Props {
  detailUrl: '/admin/product-checks/$id' | '/seller/product-checks/$id';
  from: '/admin/product-checks/' | '/seller/product-checks/';
}

export const DraftProductsTable = ({ detailUrl, from }: Props) => {
  const columns = useDraftProductTableColumns({ detailUrl });
  const params = useSearch({ from });

  const draftProductsQuery = useQuery(
    getDraftProductsQueryOptions({
      params
    })
  );

  const products = draftProductsQuery.data?.data.results || [];
  const total = draftProductsQuery.data?.data.count || 0;

  const { table } = useDataTable({
    columns,
    data: products,
    rowCount: total,
    getRowId: (row) => String(row.id),
    initialState: {
      columnPinning: {
        right: ['actions']
      }
    }
  });

  return (
    <DataTable
      table={table}
      isLoading={draftProductsQuery.isLoading}
      loadingOptions={{
        columnCount: table.getAllColumns().length
      }}
    >
      <DataTableToolbar table={table} />
    </DataTable>
  );
};
