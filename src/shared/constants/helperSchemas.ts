import { t } from '@lingui/core/macro';
import { z } from 'zod';

export const createFileArraySchema = (size = 50 * 1024 * 1024) =>
  z.array(z.custom<File>()).refine((files) => files.every((file) => file.size <= size), {
    message: t`File size must be less than 50MB`
  });
