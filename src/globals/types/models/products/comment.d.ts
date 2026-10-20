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
  product: {
    average_rating: string;
    id: number;
    image: string | null;
    name: string;
  };
}

type CommentsResponse = Pagination<Comment>;

interface ProductCommentStatus {
  can_comment: boolean;
  has_commented: boolean;
}
