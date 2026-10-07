import { useLingui } from '@lingui/react/macro';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ReadyState } from 'react-use-websocket';
import { toast } from 'sonner';

import type { UploadedFileItem } from '@/modules/chat';

import { MESSAGES_QUERY_KEYS } from '@/modules/chat';
import { postSendMessage } from '@/shared/api';

interface Params {
  conversationId: number | null;
  readyState: ReadyState;
  uploadedFiles: UploadedFileItem[];
  setUploadedFiles: (files: UploadedFileItem[]) => void;
}

export const useSendChatMessage = ({
  conversationId,
  readyState,
  setUploadedFiles,
  uploadedFiles
}: Params) => {
  const { t } = useLingui();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState('');

  const sendFileMutation = useMutation({
    mutationFn: postSendMessage,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: MESSAGES_QUERY_KEYS.base() });
      setUploadedFiles([]);
    },
    onError: () => toast.error(t`Failed to send message.`)
  });

  const handleSendMessage = () => {
    if (!conversationId) return;
    if (readyState !== ReadyState.OPEN) {
      toast.error(t`Chat is not connected yet.`);
      return;
    }

    const message = newMessage.trim();
    const data = new FormData();
    uploadedFiles.forEach((item, index) => data.append(`files[${index}]file`, item.file));
    if (message) data.append('message', message);
    sendFileMutation.mutate({ id: conversationId, data });
    setNewMessage('');
  };

  return {
    handleSendMessage,
    isSending: sendFileMutation.isPending,
    newMessage,
    setNewMessage
  };
};
