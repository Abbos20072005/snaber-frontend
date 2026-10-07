import { useLingui } from '@lingui/react/macro';
import { useState } from 'react';
import { toast } from 'sonner';

export const useChatOrderStatus = (conversationId: number | null) => {
  const { t } = useLingui();
  const orderStatuses = [t`Pending`, t`Process`, t`Packing`, t`Delivering`, t`Completed`] as const;
  const [statusByConversationId, setStatusByConversationId] = useState<Record<number, number>>({});
  const currentStatusIndex = conversationId ? (statusByConversationId[conversationId] ?? 0) : 0;
  const isCompleted = currentStatusIndex >= orderStatuses.length - 1;

  const handleNextStatus = () => {
    if (!conversationId) return;

    if (isCompleted) {
      toast.success(t`Order is already completed.`);

      return;
    }

    setStatusByConversationId((prev) => {
      const prevIndex = prev[conversationId] ?? 0;
      const nextIndex = Math.min(prevIndex + 1, orderStatuses.length - 1);
      const nextStatusLabel = orderStatuses[nextIndex];

      toast.success(t`Order status updated to ${nextStatusLabel}.`);

      return { ...prev, [conversationId]: nextIndex };
    });
  };

  return {
    currentStatusIndex,
    handleNextStatus,
    isCompleted,
    orderStatuses
  };
};
