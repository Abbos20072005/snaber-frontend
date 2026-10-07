interface CommentDto {
  images: File[];
  rating: number;
  text: string;
  variant: number;
}

type PostCommentDto = CommentDto;
type PatchCommentDto = Partial<CommentDto>;
