import type { MessageDescriptor } from '@lingui/core';

import { msg } from '@lingui/core/macro';

export type AuthModalStep = 'phone' | 'verify';

export const authModalStepLabelMap: Record<AuthModalStep, MessageDescriptor> = {
  phone: msg`Login or register`,
  verify: msg`Verify`
};
