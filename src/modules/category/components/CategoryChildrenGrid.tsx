import { CATEGORY_CARD_GRID, CategoryCard } from './CategoryCard';

interface Props {
  categories: Category[];
}

// Next level of the category tree — shown instead of the product list until a leaf is reached.
export const CategoryChildrenGrid = ({ categories }: Props) => (
  <div className={CATEGORY_CARD_GRID}>
    {categories.map((category) => (
      <CategoryCard key={category.id} category={category} />
    ))}
  </div>
);
