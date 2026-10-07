import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import Cookies from 'js-cookie';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import type { OAuthVerifyFormSchema } from '@/modules/oauth';

import { AUTH_QUERY_KEYS } from '@/modules/auth';
import { OAuthVerifyForm } from '@/modules/oauth';
import { patchAuthMe, postOAuthGoogle } from '@/shared/api';
import { COOKIES } from '@/shared/constants';
import { toFormData } from '@/shared/lib/form-data.ts';
import { Dialog, DialogContent } from '@/shared/ui/dialog';
import { Spinner } from '@/shared/ui/spinner';

interface Props {
  oAuthCode: string;
}

export const OAuthRegister = ({ oAuthCode }: Props) => {
  const [showOAuthDialog, setShowOAuthDialog] = useState<boolean>(false);
  const [step, setStep] = useState<'init' | 'register'>('init');
  const [oAuthContent, setOAuthContent] = useState<OAuthGoogleData | null>(null);
  const exchangedCodeRef = useRef<string | null>(null);

  const navigate = useNavigate();

  const { t } = useLingui();

  useEffect(() => {
    if (step !== 'init') return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [step]);

  const clearAllSearchParams = useCallback(() => {
    void navigate({
      to: '/',
      replace: true
    });
  }, [navigate]);

  const initOAuthMutation = useMutation({
    mutationFn: postOAuthGoogle,
    onSuccess: (data) => {
      Cookies.set(COOKIES.ACCESS_TOKEN, data.data.access, { expires: 7 });
      Cookies.set(COOKIES.REFRESH_TOKEN, data.data.refresh, { expires: 7 });

      if (!data.data.needs_setup) {
        clearAllSearchParams();
        setShowOAuthDialog(false);
        return;
      }

      if (!data.data.user) {
        toast.error(t`Failed to complete registration. Please try again.`);
        clearAllSearchParams();
        return;
      }

      setOAuthContent(data.data);
      setStep('register');
      setShowOAuthDialog(true);
    },
    onError: () => {
      toast.error(t`Your email is not registered. Please complete the registration to continue.`);
      clearAllSearchParams();
    },
    meta: {
      withoutToastOnError: true
    }
  });

  const profileMutation = useMutation({
    mutationFn: patchAuthMe,
    onSuccess: () => {
      toast.success(t`Registration completed successfully.`);
      clearAllSearchParams();
    },
    onError: () => {
      toast.error(t`Failed to complete registration. Please try again.`);
      clearAllSearchParams();
    },
    meta: {
      invalidatesQuery: AUTH_QUERY_KEYS.me()
    }
  });

  useEffect(() => {
    if (!oAuthCode) return;
    if (exchangedCodeRef.current === oAuthCode) return;

    exchangedCodeRef.current = oAuthCode;
    initOAuthMutation.mutate({
      data: {
        code: oAuthCode
      }
    });
  }, [oAuthCode]);

  const onSubmit = (values: OAuthVerifyFormSchema) => {
    profileMutation.mutate({
      data: toFormData({
        full_name: values.full_name,
        role: values.role,
        currency: values.currency,
        country: values.country,
        phone_number: values.phone_number
      })
    });
  };

  if (step === 'init')
    return (
      <div className='fixed inset-0 z-50 grid place-items-center backdrop-blur-sm'>
        <div className='bg-muted flex flex-col items-center gap-3 rounded-lg border px-6 py-5 shadow-lg'>
          <Spinner className='text-primary size-6' />
          <p className='text-muted-foreground text-sm font-medium'>{t`Loading...`}</p>
        </div>
      </div>
    );

  if (!oAuthContent?.user) return null;

  return (
    <Dialog
      onOpenChange={(open) => {
        setShowOAuthDialog(open);
        if (!open) clearAllSearchParams();
      }}
      open={showOAuthDialog}
    >
      <DialogContent>
        <OAuthVerifyForm
          isSubmitting={profileMutation.isPending}
          user={oAuthContent.user}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
};
