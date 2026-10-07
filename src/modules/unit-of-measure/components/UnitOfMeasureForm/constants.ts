import { t } from '@lingui/core/macro';
import { z } from 'zod';

export const unitOfMeasureSchema = () =>
  z.object({
    unit: z.string().min(1, t`Unit of measure is required`)
  });

export type UnitOfMeasureSchema = z.infer<ReturnType<typeof unitOfMeasureSchema>>;
