import type { MessageDescriptor } from '@lingui/core';

import { msg } from '@lingui/core/macro';

export type AuthModalStep = 'forget-password' | 'login' | 'register' | 'verify';

export const authModalStepLabelMap: Record<AuthModalStep, MessageDescriptor> = {
  login: msg`Login`,
  register: msg`Register`,
  verify: msg`Verify`,
  'forget-password': msg`Forget password`
};
