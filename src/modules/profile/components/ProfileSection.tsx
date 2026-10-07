import { useLingui } from '@lingui/react/macro';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useId } from 'react';
import { toast } from 'sonner';

import { AUTH_QUERY_KEYS, useAuth } from '@/modules/auth';
import { patchAuthMe } from '@/shared/api';
import { toFormData } from '@/shared/lib/form-data';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/shared/ui/card';

import { ProfileForm } from './ProfileForm';

export const ProfileSection = () => {
  const formId = useId();
  const { t } = useLingui();
  const queryClient = useQueryClient();

  const { user } = useAuth();

  const profileMutation = useMutation({
    mutationFn: patchAuthMe,
    onSuccess: () => {
      toast.success(t`Profile updated successfully`);
      void queryClient.invalidateQueries();
    },
    onError: () => toast.error(t`Failed to update profile`),
    meta: {
      invalidatesQuery: AUTH_QUERY_KEYS.me()
    }
  });

  return (
    <Card className='scroll-mt-4' id='profile'>
      <CardHeader>
        <CardTitle>{t`Profile`}</CardTitle>
        <CardDescription>{t`Manage your personal and public information.`}</CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileForm
          defaultValues={user}
          formId={formId}
          onSubmit={(value) => {
            profileMutation.mutate({
              data: toFormData({
                full_name: value.full_name,
                phone_number: value.phone_number,
                country: value.country,
                currency: value.currency,
                image: value.image[0]
              })
            });
          }}
        />
      </CardContent>
      <CardFooter className='justify-end'>
        <Button type='submit' form={formId} loading={profileMutation.isPending}>
          {t`Save profile`}
        </Button>
      </CardFooter>
    </Card>
  );
};
