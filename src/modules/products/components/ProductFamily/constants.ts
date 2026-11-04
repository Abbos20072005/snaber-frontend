import { t } from '@lingui/core/macro';
import { z } from 'zod';

export const familySchema = () =>
  z.object({
    name_en: z.string(),
    name_ru: z.string(),
    name_uz: z.string().min(1, t`Name is required`)
  });

export type FamilySchema = z.infer<ReturnType<typeof familySchema>>;

// The API answers with a code per field, the text is ours so it follows the site language.
export const getVariantErrorMessage = (error: unknown) => {
  const errors = (error as { response?: { data?: { errors?: Record<string, string> } } }).response
    ?.data?.errors;

  switch (Object.values(errors ?? {})[0]) {
    case 'base_product_not_in_family':
      return t`The product does not belong to this family.`;
    case 'family_axis_category':
    case 'variant_axis_invalid':
      return t`The option does not belong to the category of the product.`;
    case 'family_category_mismatch':
    case 'family_product_category':
      return t`The product is in another category.`;
    case 'family_product_taken':
      return t`The product is already in another family.`;
    case 'unique':
    case 'variant_sku_duplicate':
    case 'variant_sku_taken':
      return t`This code is already used by another product.`;
    case 'variant_axis_multiple':
      return t`Pick only one value for each option.`;
    case 'variant_options_duplicate':
      return t`A variant with these options already exists.`;
    default:
      return t`Something went wrong!`;
  }
};

export const toSkuPart = (text: string) =>
  text
    .toUpperCase()
    .replace(/\s+/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-|-$/g, '');

// Every combination of one value per list: [[1, 2], [3]] -> [[1, 3], [2, 3]].
export const buildCombinations = (lists: number[][]): number[][] =>
  lists.reduce<number[][]>(
    (combinations, list) =>
      combinations.flatMap((combination) => list.map((item) => [...combination, item])),
    [[]]
  );
