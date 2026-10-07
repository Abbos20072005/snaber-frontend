import { useQuery } from '@tanstack/react-query';
import { useSearch } from '@tanstack/react-router';

import { getAllAttributesByCategoryQueryOptions } from '@/modules/attributes';
import { useDataTable } from '@/shared/hooks/use-data-table';
import { DataTable } from '@/shared/ui/data-table';

import { useAttributeTableColumns } from '../hooks';

interface AttributesTableProps {
  onManageValues?: (attribute: Attribute) => void;
}

export const AttributesTable = ({ onManageValues }: AttributesTableProps) => {
  const columns = useAttributeTableColumns({ onManageValues });
  const params = useSearch({ from: '/admin/attributes/' });
  const attributesQuery = useQuery(getAllAttributesByCategoryQueryOptions({ params }));
  const attributes = attributesQuery.data?.data ?? [];

  const { table } = useDataTable({
    columns,
    data: attributes,
    rowCount: attributes.length,
    getRowId: (row) => String(row.id),
    initialState: {
      columnPinning: { right: ['actions'] }
    }
  });

  return (
    <DataTable
      table={table}
      isLoading={attributesQuery.isLoading}
      loadingOptions={{
        columnCount: columns.length,
        withPagination: false
      }}
    />
  );
};
