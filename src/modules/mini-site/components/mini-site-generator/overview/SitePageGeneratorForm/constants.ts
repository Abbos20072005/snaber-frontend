import { t } from '@lingui/core/macro';
import { z } from 'zod';

import { createFileArraySchema } from '@/shared/constants/helperSchemas';

export const siteGeneratorSchemaForm = () =>
  z.object({
    address: z.string(),
    avg_answer_time: z.string(),
    avg_delivery_time: z.string(),
    cover: createFileArraySchema(),
    description_uz: z.string(),
    description_en: z.string(),
    description_ru: z.string(),
    email: z.string().email(),
    facebook: z.union([
      z.string().url({
        message: t`Invalid URL`
      }),
      z.literal('')
    ]),
    industries: z.array(z.string()),
    instagram: z.union([
      z.string().url({
        message: t`Invalid URL`
      }),
      z.literal('')
    ]),
    latitude: z.number(),
    logo: createFileArraySchema(),
    longitude: z.number(),
    name_uz: z.string(),
    name_en: z.string(),
    name_ru: z.string(),
    own_site: z.union([
      z.string().url({
        message: t`Invalid URL`
      }),
      z.literal('')
    ]),
    phone: z.string(),
    region: z.object({
      value: z.string(),
      label: z.string()
    }),
    status: z.string(),
    telegram: z.union([
      z.string().url({
        message: t`Invalid URL`
      }),
      z.literal('')
    ]),
    whatsapp: z.union([
      z.string().url({
        message: t`Invalid URL`
      }),
      z.literal('')
    ]),
    youtube: z.union([
      z.string().url({
        message: t`Invalid URL`
      }),
      z.literal('')
    ]),
    features: z.array(
      z.object({
        name_uz: z.string(),
        name_ru: z.string(),
        name_en: z.string()
      })
    ),
    inn: z
      .string()
      .min(9, t`This field is required.`)
      .max(9, t`This field is required.`)
  });

export type SiteGeneratorSchemaForm = z.infer<ReturnType<typeof siteGeneratorSchemaForm>>;
