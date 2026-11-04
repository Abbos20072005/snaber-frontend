interface CommentDto {
  images: File[];
  product: number;
  rating: number;
  text: string;
}

type PostCommentDto = CommentDto;
type PatchCommentDto = Partial<CommentDto>;
