import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';

import { getProductsQueryOptions, useProductTableColumns } from '@/modules/products';
import { useDataTable } from '@/shared/hooks/use-data-table';
import { DataTable, DataTableToolbar } from '@/shared/ui/data-table';

export const ProductsTable = () => {
  const columns = useProductTableColumns();
  const params = useSearch({ from: '/admin/products/' });
  const queryParams = {
    page: 1,
    page_size: 10,
    ...params
  };

  const productsQuery = useQuery(
    getProductsQueryOptions({
      params: queryParams
    })
  );

  const products = productsQuery.data?.data.results || [];
  const count = productsQuery.data?.data.count || 0;

  const { table } = useDataTable({
    columns,
    data: products,
    rowCount: count,
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
      isLoading={productsQuery.isLoading}
      loadingOptions={{
        columnCount: table.getAllColumns().length
      }}
    >
      <DataTableToolbar table={table} />
    </DataTable>
  );
};
