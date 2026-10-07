import { useQuery } from '@tanstack/react-query';

import { useDataTable } from '@/shared/hooks/use-data-table';
import { DataTable } from '@/shared/ui/data-table';

import { useFaqsTableColumns } from '../hooks/useFaqsTableColumns';
import { getFaqsOptions } from '../options';

export const FaqsDataTable = () => {
  const columns = useFaqsTableColumns();

  const faqsQuery = useQuery(getFaqsOptions());
  const faqs = faqsQuery.data;

  const { table } = useDataTable({
    columns,
    data: faqs || [],
    rowCount: 20,
    getRowId: (row) => String(row.id),
    initialState: {
      columnPinning: { right: ['actions'] }
    }
  });
  return (
    <DataTable
      table={table}
      isLoading={false}
      loadingOptions={{
        columnCount: table.getAllColumns().length
      }}
    />
  );
};
