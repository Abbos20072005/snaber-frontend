interface Message {
  created_at: string;
  id: number;
  message: string;
  sender: number;
  files: {
    id: number;
    file: string;
  }[];
}

type MessagesResponse = Pagination<Message>;
