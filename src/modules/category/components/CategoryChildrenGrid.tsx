import { CATEGORY_TILE_GRID, CategoryTile } from './CategoryTile';

interface Props {
  categories: Category[];
}

// Next level of the category tree — shown instead of the product list until a leaf is reached.
// Uses the same tiles and grid as the subcategories on the catalog page.
export const CategoryChildrenGrid = ({ categories }: Props) => (
  <div className={CATEGORY_TILE_GRID}>
    {categories.map((category) => (
      <CategoryTile key={category.id} category={category} />
    ))}
  </div>
);
