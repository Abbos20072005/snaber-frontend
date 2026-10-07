import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { createMember } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';

import type { CreateMemberFormValues } from './member-form/constants';

import { COMPANY_MEMBERS_QUERY_KEYS } from '../options';
import { MemberForm } from './member-form';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MemberFormDialog = ({ open, onOpenChange }: Props) => {
  const { t } = useLingui();

  const patchUserMutation = useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      onOpenChange(false);
      toast.success(t`Member created successfully.`);
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.data.message_key === 'permission_denied') {
          toast.error(t`You do not have permission to perform this action.`);
        } else {
          toast.error(t`Failed to create member.`);
        }
      }
    },
    meta: {
      invalidatesQuery: [...COMPANY_MEMBERS_QUERY_KEYS.base()],
      withoutToastOnError: true
    }
  });

  const onSubmitForm = (values: CreateMemberFormValues) => {
    const data: CreateMemberFormValues = {
      ...values
    };

    patchUserMutation.mutate({
      data
    });
  };
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t`Create member`}</DialogTitle>
        </DialogHeader>
        <MemberForm onSubmit={onSubmitForm} />
        <Button
          className='ml-auto w-fit'
          type='submit'
          form='member-form'
          loading={patchUserMutation.isPending}
        >
          {t`Save changes`}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
