import { CategoryTile } from './CategoryTile';

interface Props {
  categories: Category[];
}

// Next level of the category tree — shown instead of the product list until a leaf is reached.
// Uses the same tiles and grid as the subcategories on the catalog page.
export const CategoryChildrenGrid = ({ categories }: Props) => (
  <div className='grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-2.5'>
    {categories.map((category) => (
      <CategoryTile key={category.id} category={category} variant='wide' />
    ))}
  </div>
);
