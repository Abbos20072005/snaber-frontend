import type { VariantProps } from 'class-variance-authority';

import React from 'react';

import type { buttonVariants } from '@/shared/ui/button.tsx';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/shared/ui/alert-dialog.tsx';
import { Button } from '@/shared/ui/button.tsx';

type ButtonVariant = VariantProps<typeof buttonVariants>['variant'];

interface ConfirmDialogProps {
  cancelLabel?: string;
  confirmButtonProps?: Omit<React.ComponentProps<typeof Button>, 'loading'>;
  confirmLabel?: string;
  confirmVariant?: ButtonVariant;
  description: string;
  loading?: boolean;
  open?: boolean;
  title: string;
  trigger?: React.ReactNode;
  onConfirm?: () => void;
  onOpenChange?: (open: boolean) => void;
}

export const ConfirmDialog = ({
  trigger,
  title,
  description,
  onConfirm,
  loading = false,
  open,
  onOpenChange,
  confirmLabel = 'Tasdiqlash',
  cancelLabel = 'Bekor qilish',
  confirmButtonProps,
  confirmVariant
}: ConfirmDialogProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

  return (
    <AlertDialog onOpenChange={setIsOpen} open={isOpen}>
      {trigger && <AlertDialogTrigger render={<>{trigger}</>} />}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <Button
            {...confirmButtonProps}
            variant={confirmVariant}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
