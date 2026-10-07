import type { QueryKey } from '@tanstack/react-query';

import { useMutation } from '@tanstack/react-query';
import React from 'react';
import { toast } from 'sonner';

interface UseConfirmActionOptions<TData = unknown> {
  invalidatesQuery?: QueryKey;
  successMessage: string;
  mutationFn: () => Promise<TData>;
  onSuccess?: (data: TData) => void;
}

export function useConfirmAction<TData = unknown>(options: UseConfirmActionOptions<TData>) {
  const [open, setOpen] = React.useState(false);

  const mutation = useMutation({
    mutationFn: options.mutationFn,
    onSuccess: (data) => {
      toast.success(options.successMessage);
      setOpen(false);
      options.onSuccess?.(data);
    },
    meta: options.invalidatesQuery ? { invalidatesQuery: options.invalidatesQuery } : undefined
  });

  return {
    open,
    onOpenChange: setOpen,
    onConfirm: () => mutation.mutate(),
    loading: mutation.isPending
  };
}
