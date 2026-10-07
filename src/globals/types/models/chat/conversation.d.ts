interface Conversation {
  created_at: string;
  id: number;
  order: unknown;
  product_variant: number;
  type: string;
  unread_message_count: number;
  updated_at: string;
  buyer: {
    id: number;
    full_name: string;
    email: string;
  };
  seller: {
    id: number;
    full_name: string;
    email: string;
  };
}

type ConversationsResponse = Pagination<Conversation>;

// Dto

interface PostStartConversationDto {
  order?: number;
  product_variant?: number;
  type: 'order' | 'product';
}
