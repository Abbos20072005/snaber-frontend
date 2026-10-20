interface CommentDto {
  images: File[];
  rating: number;
  text: string;
  product: number;
}

type PostCommentDto = CommentDto;
type PatchCommentDto = Partial<CommentDto>;
