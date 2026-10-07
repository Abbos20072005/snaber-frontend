import type { Dispatch, SetStateAction } from 'react';

import { createContext, use, useState } from 'react';

import { AuthDialog } from '@/modules/auth/components';

import type { AuthModalStep } from '../constants/auth';

interface AuthContextType {
  email: string;
  isOpen: boolean;
  setEmail: Dispatch<SetStateAction<string>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setStep: Dispatch<SetStateAction<AuthModalStep>>;
  step: AuthModalStep;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [step, setStep] = useState<AuthModalStep>('login');
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState<string>('');

  return (
    <AuthContext.Provider value={{ step, setStep, isOpen, setIsOpen, email, setEmail }}>
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
