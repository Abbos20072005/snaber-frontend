import { useLingui } from '@lingui/react/macro';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import Cookies from 'js-cookie';
import { ChevronLeftIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AUTH_QUERY_KEYS } from '@/modules/auth';
import { postOtpSend, postOtpVerify } from '@/shared/api';
import { COOKIES, CROSS_SITE_COOKIE_OPTIONS } from '@/shared/constants';
import { useAuthContext } from '@/shared/context';
import { Button } from '@/shared/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp';

export const VerifyForm = () => {
  const { t } = useLingui();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setStep, phone, setIsOpen, resendAt, setResendAt } = useAuthContext();
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState(
    Math.max(0, Math.ceil((resendAt - Date.now()) / 1000))
  );

  const OTP_LENGTH: number = 6;

  const handleOtpChange = (value: string) => {
    setOtpCode(value);
    if (otpError) setOtpError(null);
  };

  const verifyOtpMutation = useMutation({
    mutationFn: () =>
      postOtpVerify({
        data: {
          phone_number: phone,
          otp_code: otpCode
        }
      }),
    onSuccess: (data) => {
      Cookies.set(COOKIES.ACCESS_TOKEN, data.data.result.access_token, CROSS_SITE_COOKIE_OPTIONS);
      Cookies.set(COOKIES.REFRESH_TOKEN, data.data.result.refresh_token, CROSS_SITE_COOKIE_OPTIONS);
      toast.success(t`Phone number verified. Welcome!`);
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
    mutationFn: postOtpSend,
    onSuccess: ({ data }) => {
      setResendAt(Date.now() + data.result.resend_after * 1000);
      setResendCooldown(data.result.resend_after);
      toast.success(t`Code resent successfully`);
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
    verifyOtpMutation.mutate();
  };

  const handleResendCode = () => {
    if (!phone || resendCooldown > 0 || resendOtpMutation.isPending) return;

    resendOtpMutation.mutate({ data: { phone_number: phone } });
  };

  return (
    <form className='grid gap-4' onSubmit={handleSubmit}>
      <div className='flex items-center justify-between rounded-lg border border-dashed p-3 text-sm'>
        <p className='font-medium'>{t`Code sent to`}</p>
        <p className='text-muted-foreground mt-1'>{phone}</p>
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
          className='shrink-0 px-0'
          disabled={resendCooldown > 0 || resendOtpMutation.isPending}
          type='button'
          variant='link'
          onClick={handleResendCode}
        >
          {resendOtpMutation.isPending ? t`Resending...` : t`Resend code`}
        </Button>
        <span className='text-muted-foreground text-right text-xs'>
          {resendCooldown > 0 ? t`Try again in ${resendCooldown}s` : t`You can resend now`}
        </span>
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <Button className='w-full' type='button' variant='outline' onClick={() => setStep('phone')}>
          <ChevronLeftIcon />
          {t`Back`}
        </Button>
        <Button className='w-full' type='submit'>
          {t`Verify`}
        </Button>
      </div>
    </form>
  );
};
