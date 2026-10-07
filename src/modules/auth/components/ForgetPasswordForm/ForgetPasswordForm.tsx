import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ChevronLeftIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  postForgetPassword,
  postForgetPasswordResend,
  postForgetPasswordVerify
} from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { useAppForm } from '@/shared/ui/form/hooks';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/shared/ui/input-otp';

import type { ForgetPasswordEmailFormSchema, ForgetPasswordVerifyFormSchema } from './constants';

import { forgetPasswordEmailFormSchema, forgetPasswordVerifyFormSchema } from './constants';

interface ForgetPasswordFormProps {
  onBackToLogin: () => void;
  onSuccess: () => void;
}

type ForgetPasswordStep = 'email' | 'verify';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN_SECONDS = 60;

const emailDefaultValues = {
  email: ''
} satisfies ForgetPasswordEmailFormSchema as ForgetPasswordEmailFormSchema;

const verifyDefaultValues = {
  otp_code: '',
  new_password: '',
  confirm_password: ''
} satisfies ForgetPasswordVerifyFormSchema as ForgetPasswordVerifyFormSchema;

export const ForgetPasswordForm = ({ onBackToLogin, onSuccess }: ForgetPasswordFormProps) => {
  const { t } = useLingui();
  const [step, setStep] = useState<ForgetPasswordStep>('email');
  const [email, setEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const requestCodeMutation = useMutation({
    mutationFn: postForgetPassword,
    onSuccess: () => {
      setStep('verify');
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      toast.success(t`Verification code sent`);
    },
    meta: {
      withoutToastOnError: true
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 404)
        toast.error(t`Email not found`);
      else toast.error(t`Failed to send verification code`);
    }
  });

  const verifyMutation = useMutation({
    mutationFn: postForgetPasswordVerify,
    onSuccess: () => {
      toast.success(t`Password updated successfully`);
      emailForm.reset(emailDefaultValues);
      verifyForm.reset(verifyDefaultValues);
      onSuccess();
    },
    meta: {
      withoutToastOnError: true
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 400)
        toast.error(t`Invalid verification code`);
      else toast.error(t`Password updated failed`);
    }
  });

  const resendCodeMutation = useMutation({
    mutationFn: postForgetPasswordResend,
    onSuccess: () => {
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      toast.success(t`Code resent successfully`);
    },
    meta: {
      withoutToastOnError: true
    },
    onError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 400)
        toast.error(t`You have reached the maximum number of OTP requests. Please try again later.`);
      else toast.error(t`Failed to resend code`);
    }
  });

  const emailForm = useAppForm({
    validators: { onChange: forgetPasswordEmailFormSchema() },
    defaultValues: emailDefaultValues,
    onSubmit: ({ value }) => {
      setEmail(value.email);
      requestCodeMutation.mutate({ data: value });
    }
  });

  const verifyForm = useAppForm({
    validators: { onChange: forgetPasswordVerifyFormSchema() },
    defaultValues: verifyDefaultValues,
    onSubmit: ({ value }) => {
      verifyMutation.mutate({
        data: {
          email,
          ...value
        }
      });
    }
  });

  const handleBackToEmail = () => {
    setStep('email');
    verifyForm.reset(verifyDefaultValues);
  };

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const intervalId = window.setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [resendCooldown]);

  const handleResendCode = () => {
    if (!email || resendCooldown > 0 || resendCodeMutation.isPending) return;

    resendCodeMutation.mutate({
      data: {
        email
      }
    });
  };

  if (step === 'verify') {
    return (
      <verifyForm.AppForm>
        <form
          className='grid gap-4'
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void verifyForm.handleSubmit();
          }}
        >
          <div className='flex flex-col gap-1 rounded-lg border border-dashed p-3 text-sm'>
            <p className='font-medium'>{t`Code sent to`}</p>
            <p className='text-muted-foreground'>{email}</p>
          </div>

          <verifyForm.AppField name='otp_code'>
            {(field) => (
              <div className='grid gap-2'>
                <InputOTP
                  id={field.name}
                  maxLength={OTP_LENGTH}
                  value={field.state.value}
                  autoComplete='one-time-code'
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                >
                  <InputOTPGroup className='mx-auto'>
                    {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                {field.state.meta.isTouched && !field.state.meta.isValid && (
                  <p className='text-destructive text-center text-xs'>
                    {t`Enter the 6-digit verification code`}
                  </p>
                )}
                <div className='flex items-center justify-between gap-3 text-sm'>
                  <Button
                    className='h-auto px-0'
                    disabled={resendCooldown > 0 || resendCodeMutation.isPending}
                    type='button'
                    variant='link'
                    onClick={handleResendCode}
                  >
                    {resendCodeMutation.isPending ? t`Resending...` : t`Resend code`}
                  </Button>
                  <span className='text-muted-foreground'>
                    {resendCooldown > 0
                      ? t`Try again in ${resendCooldown}s`
                      : t`You can resend now`}
                  </span>
                </div>
              </div>
            )}
          </verifyForm.AppField>
          <verifyForm.AppField name='new_password'>
            {(field) => (
              <field.PasswordInput
                isRequired
                label={t`New password`}
                autoComplete='new-password'
                placeholder='********'
              />
            )}
          </verifyForm.AppField>
          <verifyForm.AppField name='confirm_password'>
            {(field) => (
              <field.PasswordInput
                isRequired
                label={t`Confirm new password`}
                placeholder='********'
              />
            )}
          </verifyForm.AppField>

          <div className='grid grid-cols-2 gap-2'>
            <Button
              className='w-full'
              disabled={verifyMutation.isPending}
              type='button'
              variant='outline'
              onClick={handleBackToEmail}
            >
              <ChevronLeftIcon />
              {t`Back`}
            </Button>
            <Button className='w-full' type='submit' loading={verifyMutation.isPending}>
              {t`Update password`}
            </Button>
          </div>
        </form>
      </verifyForm.AppForm>
    );
  }

  return (
    <emailForm.AppForm>
      <form
        className='grid gap-4'
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void emailForm.handleSubmit();
        }}
      >
        <emailForm.AppField name='email'>
          {(field) => <field.Input isRequired label='Email' placeholder={t`Enter your email`} />}
        </emailForm.AppField>
        <div className='grid grid-cols-2 gap-2'>
          <Button
            className='w-full'
            disabled={requestCodeMutation.isPending}
            type='button'
            variant='outline'
            onClick={onBackToLogin}
          >
            <ChevronLeftIcon />
            {t`Back`}
          </Button>
          <Button className='w-full' type='submit' loading={requestCodeMutation.isPending}>
            {t`Send code`}
          </Button>
        </div>
      </form>
    </emailForm.AppForm>
  );
};
