import { useLingui } from '@lingui/react/macro';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { ChevronLeftIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AUTH_QUERY_KEYS } from '@/modules/auth';
import { postOtpResend, postVerifyOtp } from '@/shared/api';
import { COOKIES, CROSS_SITE_COOKIE_OPTIONS } from '@/shared/constants';
import { useAuthContext } from '@/shared/context';
import { Button } from '@/shared/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp';

export const VerifyForm = () => {
  const { t } = useLingui();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setStep, email, setIsOpen } = useAuthContext();
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState(60);

  const OTP_LENGTH: number = 6;
  const RESEND_COOLDOWN_SECONDS: number = 60;

  const handleOtpChange = (value: string) => {
    setOtpCode(value);
    if (otpError) setOtpError(null);
  };

  const postVerifyOtpMutation = useMutation({
    mutationFn: () =>
      postVerifyOtp({
        data: {
          email,
          otp_code: otpCode
        }
      }),
    onSuccess: (data) => {
      Cookies.set(COOKIES.ACCESS_TOKEN, data.data.result.access_token, CROSS_SITE_COOKIE_OPTIONS);
      Cookies.set(
        COOKIES.REFRESH_TOKEN,
        data.data.result.refresh_token,
        CROSS_SITE_COOKIE_OPTIONS
      );
      toast.success(t`Email verified successfully. Welcome!`);
      setIsOpen(false);
      void queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me() });
      void router.invalidate();
    },
    meta: {
      withoutToastOnError: true
    },
    onError: () => {
      toast.error(t`Invalid verification code`);
    }
  });

  const resendOtpMutation = useMutation({
    mutationFn: postOtpResend,
    onSuccess: () => {
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      toast.success(t`Code resent successfully`);
    },
    meta: {
      withoutToastOnError: true
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.status === 400)
          toast.error(
            t`You have reached the maximum number of OTP requests. Please try again later.`
          );
      } else toast.error(t`Failed to resend code`);
    }
  });

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const intervalId = window.setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [resendCooldown]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const normalizedCode = otpCode.replace(/\D/g, '').slice(0, OTP_LENGTH);

    if (normalizedCode.length !== OTP_LENGTH) {
      setOtpError(t`Enter the 6-digit verification code`);
      return;
    }

    setOtpError(null);
    postVerifyOtpMutation.mutate();
  };

  const handleResendCode = () => {
    if (!email || resendCooldown > 0 || resendOtpMutation.isPending) return;

    resendOtpMutation.mutate({
      data: {
        email
      }
    });
  };

  return (
    <form className='grid gap-4' onSubmit={handleSubmit}>
      <div className='flex items-center justify-between rounded-lg border border-dashed p-3 text-sm'>
        <p className='font-medium'>{t`Code sent to`}</p>
        <p className='text-muted-foreground mt-1'>{email}</p>
      </div>
      <div className='grid gap-2'>
        <InputOTP
          id='register-otp-code'
          maxLength={OTP_LENGTH}
          value={otpCode}
          onChange={handleOtpChange}
        >
          <InputOTPGroup className='mx-auto'>
            {Array.from({ length: OTP_LENGTH }).map((_, index) => (
              <InputOTPSlot key={index} className='' index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        {otpError && <p className='text-destructive text-center text-xs'>{otpError}</p>}
      </div>

      <div className='flex items-center justify-between gap-3 text-sm'>
        <Button
          className='px-0'
          disabled={resendCooldown > 0 || resendOtpMutation.isPending}
          type='button'
          variant='link'
          onClick={handleResendCode}
        >
          {resendOtpMutation.isPending ? t`Resending...` : t`Resend code`}
        </Button>
        <span className='text-muted-foreground'>
          {resendCooldown > 0 ? t`Try again in ${resendCooldown}s` : t`You can resend now`}
        </span>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <Button className='w-full' type='button' variant='outline' onClick={() => setStep('login')}>
          <ChevronLeftIcon />
          {t`Back`}
        </Button>
        <Button className='w-full' type='submit'>
          {t`Verify and finish`}
        </Button>
      </div>
    </form>
  );
};
