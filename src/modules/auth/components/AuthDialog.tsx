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

import { PhoneForm } from './PhoneForm';
import { VerifyForm } from './VerifyForm';

export const AuthDialog = () => {
  const { t } = useLingui();
  const { step, setStep, setIsOpen, isOpen } = useAuthContext();

  return (
    <Dialog
      // a stray click outside must not drop a half-typed code
      disablePointerDismissal={step === 'verify'}
      onOpenChange={(open) => {
        if (!open) {
          setIsOpen(open);
          setStep('phone');
        }
      }}
      open={isOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t(authModalStepLabelMap[step as AuthModalStep])}</DialogTitle>
          {step === 'phone' && (
            <DialogDescription>
              {t`Enter your phone number and we will send you a verification code.`}
            </DialogDescription>
          )}
        </DialogHeader>
        {step === 'phone' ? <PhoneForm /> : <VerifyForm />}
      </DialogContent>
    </Dialog>
  );
};
