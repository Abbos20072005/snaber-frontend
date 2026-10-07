import { useLingui } from '@lingui/react/macro';

import type { AuthModalStep } from '@/shared/constants/auth';

import { authModalStepLabelMap } from '@/shared/constants/auth';
import { useAuthContext } from '@/shared/context';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

import { ForgetPasswordForm } from './ForgetPasswordForm';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { VerifyForm } from './VerifyForm';

export const AuthDialog = () => {
  const { t } = useLingui();
  const { step, setStep, setIsOpen, isOpen } = useAuthContext();

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) setIsOpen(open);
        setStep('login');
      }}
      open={isOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t(authModalStepLabelMap[step as AuthModalStep])}</DialogTitle>
          {step === 'forget-password' && (
            <DialogDescription>
              {t`Enter your email address and we will send a verification code to reset your password.`}
            </DialogDescription>
          )}
        </DialogHeader>
        <Tabs className={'w-full'} value={step} onValueChange={setStep}>
          {(step === 'login' || step === 'register') && (
            <TabsList className='grid h-10 w-full grid-cols-2'>
              <TabsTrigger value='login'>{t`Login`}</TabsTrigger>
              <TabsTrigger value='register'>{t`Register`}</TabsTrigger>
            </TabsList>
          )}

          <TabsContent value={'login'}>
            <LoginForm />
          </TabsContent>
          <TabsContent value={'register'}>
            <RegisterForm />
          </TabsContent>
          <TabsContent value={'verify'}>
            <VerifyForm />
          </TabsContent>
          <TabsContent value={'forget-password'}>
            <ForgetPasswordForm
              onBackToLogin={() => setStep('login')}
              onSuccess={() => {
                setStep('login');
                setIsOpen(false);
              }}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
