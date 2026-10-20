import type { Dispatch, SetStateAction } from 'react';

import { createContext, use, useEffect, useState } from 'react';

import { AuthDialog } from '@/modules/auth/components';

import type { AuthModalStep } from '../constants/auth';

interface AuthContextType {
  isOpen: boolean;
  phone: string;
  resendAt: number;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setPhone: Dispatch<SetStateAction<string>>;
  setResendAt: Dispatch<SetStateAction<number>>;
  setStep: Dispatch<SetStateAction<AuthModalStep>>;
  step: AuthModalStep;
}

interface StoredVerifyStep {
  phone: string;
  resendAt: number;
  savedAt: number;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'auth-verify-step';
// A code is valid for a few minutes, so an older saved step is of no use.
const STORAGE_TTL_MS = 10 * 60 * 1000;

const readStoredStep = (): StoredVerifyStep | null => {
  try {
    const stored = JSON.parse(
      sessionStorage.getItem(STORAGE_KEY) ?? 'null'
    ) as StoredVerifyStep | null;
    return stored && Date.now() - stored.savedAt < STORAGE_TTL_MS ? stored : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = useState<AuthModalStep>('phone');
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState<string>('');
  const [resendAt, setResendAt] = useState<number>(0);

  // The verify step survives a page reload, e.g. when the browser drops the tab while the
  // user is away reading the code.
  useEffect(() => {
    const stored = readStoredStep();
    if (!stored) return;

    setPhone(stored.phone);
    setResendAt(stored.resendAt);
    setStep('verify');
    setIsOpen(true);
  }, []);

  useEffect(() => {
    try {
      if (isOpen && step === 'verify' && phone) {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ phone, resendAt, savedAt: Date.now() } satisfies StoredVerifyStep)
        );
      } else {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // storage is unavailable (private mode), the step just won't be restored
    }
  }, [isOpen, step, phone, resendAt]);

  return (
    <AuthContext.Provider
      value={{ step, setStep, isOpen, setIsOpen, phone, setPhone, resendAt, setResendAt }}
    >
      {children}
      <AuthDialog />
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = use(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
