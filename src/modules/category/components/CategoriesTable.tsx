import { useCategoryTableColumns } from '@/modules/category';
import { useDataTable } from '@/shared/hooks/use-data-table';
import { DataTable } from '@/shared/ui/data-table';

interface Props {
  categories: PublicAllCategoriesResponse;
}

export const CategoriesTable = ({ categories }: Props) => {
  const columns = useCategoryTableColumns();
  const { table } = useDataTable({
    columns,
    data: categories,
    rowCount: categories.length || 0,
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
    />
  );
};
