import { useQuery } from '@tanstack/react-query';
import { useMatch } from '@tanstack/react-router';

import type { GetAttributeValuesRequest } from '@/shared/api';

import { useDataTable } from '@/shared/hooks/use-data-table';
import { DataTable } from '@/shared/ui/data-table';

import { useAttributeValueTableColumns } from '../hooks';
import { getAttributeValuesQueryOptions } from '../options';

interface AttributeValuesTableProps {
  enabled?: boolean;
  request?: GetAttributeValuesRequest;
}

export const AttributeValuesTable = ({ enabled = true, request }: AttributeValuesTableProps) => {
  const columns = useAttributeValueTableColumns();

  // The table is also rendered inside the attributes page sheet, where this route isn't active.
  const params = useMatch({ from: '/admin/attribute-values/', shouldThrow: false })?.search ?? {};

  const valuesQuery = useQuery({
    ...getAttributeValuesQueryOptions({
      params: {
        ...request?.params,
        ...params
      }
    }),
    enabled
  });

  const response = valuesQuery.data?.data;
  const values = response?.results ?? [];

  const { table } = useDataTable({
    columns,
    data: values,
    rowCount: response?.count || 0,
    getRowId: (row) => String(row.id),
    initialState: {
      columnPinning: { right: ['actions'] }
    }
  });

  return (
    <DataTable
      table={table}
      isLoading={valuesQuery.isLoading}
      loadingOptions={{
        columnCount: columns.length
      }}
    />
  );
};
