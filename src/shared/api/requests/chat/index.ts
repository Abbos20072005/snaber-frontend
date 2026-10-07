import { api } from '@/shared/api';

interface PostStartConversationRequest {
  data: PostStartConversationDto;
}

export const postStartConversation = ({ data }: PostStartConversationRequest) =>
  api.post('chat/conversations/', data);

export interface GetConversationsRequest {
  params?: Partial<{
    page: number;
    page_size: number;
  }>;
}

export const getConversations = (request?: GetConversationsRequest) =>
  api.get<ConversationsResponse>('chat/conversations/', request).then(({ data }) => data);

export interface GetConversationByOrderRequest {
  orderId: number;
}

export const getConversationByOrder = ({ orderId }: GetConversationByOrderRequest) =>
  api.get<Conversation>(`order/${orderId}/conversation/`).then(({ data }) => data);

interface ConversationReadByIdRequest {
  id: number;
}

export const conversationReadById = ({ id }: ConversationReadByIdRequest) =>
  api.post(`chat/conversations/${id}/mark-read/`);

export interface GetMessagesRequest {
  id: number;
  params?: Partial<{
    page: number;
    page_size: number;
  }>;
}

export const getMessages = (request: GetMessagesRequest) =>
  api.get<MessagesResponse>(`chat/conversations/${request.id}/messages/`, {
    params: request.params
  });

interface PostSendMessageRequest {
  data: FormData;
  id: number;
}

export const postSendMessage = ({ id, data }: PostSendMessageRequest) =>
  api.post(`chat/conversations/${id}/messages/`, data);
