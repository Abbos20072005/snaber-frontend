import { CategoryTile } from './CategoryTile';

interface Props {
  categories: Category[];
}

// Next level of the category tree — shown instead of the product list until a leaf is reached.
// Uses the same tiles and grid as the subcategories on the catalog page.
export const CategoryChildrenGrid = ({ categories }: Props) => (
  <div className='grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
    {categories.map((category) => (
      <CategoryTile key={category.id} category={category} />
    ))}
  </div>
);
