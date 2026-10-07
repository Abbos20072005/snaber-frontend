import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';

import { useDataTable } from '@/shared/hooks/use-data-table';
import { DataTable, DataTableToolbar } from '@/shared/ui/data-table';

import { useCompanyTableColumns } from '../hooks/useCompanyTableColumns';
import { getCompanyDraftsQueryOptions } from '../options';

export const CompaniesTable = () => {
  const columns = useCompanyTableColumns();

  const params = useSearch({ from: '/admin/companies/' });

  const companyDraftsQuery = useQuery(getCompanyDraftsQueryOptions({ params }));
  const companyDrafts = companyDraftsQuery.data?.results || [];
  const total = companyDraftsQuery.data?.count || 0;

  const { table } = useDataTable({
    columns,
    data: companyDrafts,
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
      isLoading={companyDraftsQuery.isLoading}
      loadingOptions={{
        columnCount: table.getAllColumns().length
      }}
    >
      <DataTableToolbar table={table} />
    </DataTable>
  );
};
