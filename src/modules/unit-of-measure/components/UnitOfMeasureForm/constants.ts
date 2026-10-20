import { t } from '@lingui/core/macro';
import { z } from 'zod';

export const unitOfMeasureSchema = () =>
  z.object({
    unit_en: z.string(),
    unit_ru: z.string(),
    unit_uz: z.string().min(1, t`Unit of measure is required`)
  });

export type UnitOfMeasureSchema = z.infer<ReturnType<typeof unitOfMeasureSchema>>;
