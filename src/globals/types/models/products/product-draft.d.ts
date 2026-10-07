type ProductDraftStatus = 'accepted' | 'moderation' | 'returned_for_correction' | 'reviewing';

interface ProductConstructorPreview extends Product {
  id: number;
}

interface ProductConstructor extends ProductConstructorPreview {
  constructor_id: number;
  product_id: number;
}

type ProductDraftsResponse = Pagination<ProductConstructorPreview>;
// DTO

interface ConstructorReviewDto {
  moderator_comment: string;
  status: ProductDraftStatus;
}

type PatchConstructorReviewDto = Partial<ConstructorReviewDto>;
