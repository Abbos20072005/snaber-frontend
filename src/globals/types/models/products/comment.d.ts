interface Comment {
  created_at: string;
  id: number;
  rating: number;
  text: string;
  updated_at: string;
  images: [
    {
      id: number;
      image: string;
    }
  ];
  user: {
    id: number;
    full_name: string;
    image: string;
  };
  variant: {
    id: number;
    product_id: number;
    product_name: string;
    sku_variant: string;
    image: string;
    average_rating: string;
  };
}

type CommentsResponse = Pagination<Comment>;

interface ProductCommentStatus {
  can_comment: boolean;
  has_commented: boolean;
}
