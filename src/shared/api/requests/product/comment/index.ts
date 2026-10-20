import { api } from '@/shared/api';

export interface GetCommentsRequest {
  params?: Partial<{
    page: number;
    page_size: number;
    product: number;
  }>;
}

export const getComments = (request?: GetCommentsRequest) =>
  api.get<CommentsResponse>('review/comments/', {
    params: request?.params
  });

interface PostCommentRequest {
  data: PostCommentDto;
}

export const postComment = ({ data }: PostCommentRequest) =>
  api.post<Comment>('review/comments/', data);

export interface GetCommentByIdRequest {
  id: number;
}

export const getCommentById = ({ id }: GetCommentByIdRequest) =>
  api.get<Comment>(`review/comments/${id}`);

interface PatchCommentRequest {
  data: PatchCommentDto;
  id: number;
}
export const patchComment = ({ id, data }: PatchCommentRequest) =>
  api.patch<Comment>(`review/comments/${id}`, data);

interface DeleteCommentRequest {
  id: number;
}

export const deleteComment = ({ id }: DeleteCommentRequest) => api.delete(`review/comments/${id}`);

export interface GetProductCommentStatusRequest {
  params: {
    product: number;
  };
}

export const getProductCommentStatus = ({ params }: GetProductCommentStatusRequest) =>
  api.get<ProductCommentStatus>('review/comment-status/', {
    params
  });
