import { useLingui } from '@lingui/react/macro';
import { PlusIcon, Trash2Icon } from 'lucide-react';

import type { SiteGeneratorSchemaForm } from '@/modules/mini-site';

import { siteGeneratorSchemaForm } from '@/modules/mini-site';
import { useFileFetcher } from '@/shared/hooks/use-file-fetcher';
import { Button } from '@/shared/ui/button';
import { useAppForm } from '@/shared/ui/form/hooks';

interface Props {
  defaultValues?: Partial<MiniSite>;
  onSubmit: (values: SiteGeneratorSchemaForm) => void;
}

export const SiteGeneratorForm = ({ defaultValues, onSubmit }: Props) => {
  const { t } = useLingui();

  const coverLink = defaultValues?.cover ? [defaultValues.cover.url] : [];
  const {
    isLoading: isCoverLoading,
    isError: isCoverError,
    files: coverFiles
  } = useFileFetcher({ links: coverLink });

  const logoLink = defaultValues?.logo ? [defaultValues.logo] : [];
  const {
    isLoading: isLogoLoading,
    isError: isLogoError,
    files: logoFiles
  } = useFileFetcher({ links: logoLink });

  const form = useAppForm({
    validators: {
      onChange: siteGeneratorSchemaForm()
    },
    onSubmit: ({ value }) => {
      onSubmit(value);
    },
    defaultValues: {
      address: defaultValues?.address || '',
      name_uz: defaultValues?.name_uz || '',
      telegram: defaultValues?.info?.telegram || '',
      own_site: defaultValues?.info?.own_site || '',
      name_ru: defaultValues?.name_ru || '',
      youtube: defaultValues?.info?.youtube || '',
      name_en: defaultValues?.name_en || '',
      whatsapp: defaultValues?.info?.whatsapp || '',
      avg_answer_time: defaultValues?.info?.avg_answer_time || '',
      logo: isLogoLoading || isLogoError ? [] : logoFiles,
      instagram: defaultValues?.info?.instagram || '',
      facebook: defaultValues?.info?.facebook || '',
      longitude: defaultValues?.info?.longitude || 0,
      latitude: defaultValues?.info?.latitude || 0,
      email: defaultValues?.info?.email || '',
      features: defaultValues?.features?.length
        ? defaultValues.features.map((feature) => ({
            name_en: feature.name_en,
            name_ru: feature.name_ru,
            name_uz: feature.name_uz
          }))
        : [
            {
              name_en: '',
              name_ru: '',
              name_uz: ''
            }
          ],
      avg_delivery_time: defaultValues?.info?.avg_delivery_time || '',
      cover: isCoverLoading || isCoverError ? [] : coverFiles,
      description_en: defaultValues?.description_en || '',
      description_ru: defaultValues?.description_ru || '',
      region: {
        value: defaultValues?.region?.id ? String(defaultValues.region.id) : '',
        label: defaultValues?.region?.name || ''
      },
      description_uz: defaultValues?.description_uz || '',
      industries: defaultValues?.industries?.map((industry) => String(industry.id)) || [],
      phone: defaultValues?.info?.phone || '',
      status: defaultValues?.status || 'draft',
      inn: defaultValues?.inn || ''
    } satisfies SiteGeneratorSchemaForm as SiteGeneratorSchemaForm
  });

  return (
    <form.AppForm>
      <form
        className='space-y-4'
        id='site-generator-form'
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <article className='ring-muted rounded-2xl bg-white p-5 shadow-sm ring-1'>
          <h2 className='text-primary text-lg font-semibold'>{t`Company names`}</h2>
          <div className='mt-4 grid gap-3 sm:grid-cols-3'>
            <form.AppField name='name_uz'>
              {(field) => (
                <field.Input
                  isRequired
                  label={`${t`Name`} (Uz)`}
                  placeholder={t`Enter company name`}
                />
              )}
            </form.AppField>
            <form.AppField name='name_ru'>
              {(field) => (
                <field.Input
                  isRequired
                  label={`${t`Name`} (Ru)`}
                  placeholder={t`Enter company name`}
                />
              )}
            </form.AppField>
            <form.AppField name='name_en'>
              {(field) => (
                <field.Input
                  isRequired
                  label={`${t`Name`} (En)`}
                  placeholder={t`Enter company name`}
                />
              )}
            </form.AppField>
          </div>
        </article>

        <article className='ring-muted rounded-2xl bg-white p-5 shadow-sm ring-1'>
          <h2 className='text-primary text-lg font-semibold'>{t`Company descriptions`}</h2>
          <div className='mt-4 grid gap-3 sm:grid-cols-3'>
            <form.AppField name='description_uz'>
              {(field) => (
                <field.Textarea
                  isRequired
                  label={`${t`Description`} (Uz)`}
                  placeholder={t`Write a short company description`}
                  rows={5}
                />
              )}
            </form.AppField>
            <form.AppField name='description_ru'>
              {(field) => (
                <field.Textarea
                  isRequired
                  label={`${t`Description`} (Ru)`}
                  placeholder={t`Write a short company description`}
                  rows={5}
                />
              )}
            </form.AppField>
            <form.AppField name='description_en'>
              {(field) => (
                <field.Textarea
                  isRequired
                  label={`${t`Description`} (En)`}
                  placeholder={t`Write a short company description`}
                  rows={5}
                />
              )}
            </form.AppField>
          </div>
        </article>
        <article className='ring-muted rounded-2xl bg-white p-5 shadow-sm ring-1'>
          <h2 className='text-primary text-lg font-semibold'>{t`Brand files`}</h2>
          <div className='mt-4 grid gap-3 sm:grid-cols-2'>
            <div>
              <form.AppField name='logo'>
                {(field) => (
                  <field.FileUpload
                    accept='image/*'
                    label={t`Logo`}
                    maxFiles={1}
                    loading={isLogoLoading}
                    loadingText={t`Loading image...`}
                    uploadHint={t`Recommended logo size: 512 x 512 px`}
                  />
                )}
              </form.AppField>
              <ul className='text-muted-foreground mt-1 list-disc space-y-1 pl-5 text-sm'>
                <li>{t`Recommended size: 512 x 512 px.`}</li>
                <li>{t`Recommended ratio: 1:1.`}</li>
                <li>{t`Format: PNG or JPEG.`}</li>
              </ul>
            </div>
            <div>
              <form.AppField name='cover'>
                {(field) => (
                  <field.FileUpload
                    accept='image/*,video/*'
                    label={t`Banner`}
                    maxFiles={1}
                    loading={isCoverLoading}
                    loadingText={t`Loading content...`}
                    uploadHint={t`Recommended banner size: 1200 x 400 px`}
                  />
                )}
              </form.AppField>
              <ul className='text-muted-foreground mt-1 list-disc space-y-1 pl-5 text-sm'>
                <li>{t`Recommended size: 1200 x 400 px.`}</li>
                <li>{t`Recommended ratio: 3:1.`}</li>
                <li>{t`Format: Any image or video format.`}</li>
              </ul>
            </div>
          </div>
        </article>
        <article className='ring-muted rounded-2xl bg-white p-5 shadow-sm ring-1'>
          <h2 className='text-primary text-lg font-semibold'>{t`Contact information`}</h2>
          <div className='mt-4 grid gap-3 sm:grid-cols-2'>
            <form.AppField name='phone'>
              {(field) => (
                <field.Input isRequired label={t`Phone number`} placeholder='+998 90 123 45 67' />
              )}
            </form.AppField>
            <form.AppField name='email'>
              {(field) => (
                <field.Input
                  isRequired
                  label='Email'
                  type='email'
                  placeholder='company@example.com'
                />
              )}
            </form.AppField>
            <form.AppField name='avg_answer_time'>
              {(field) => (
                <field.Input
                  isRequired
                  label={t`Average response time`}
                  placeholder={t`2 hours`}
                />
              )}
            </form.AppField>
            <form.AppField name='avg_delivery_time'>
              {(field) => (
                <field.Input
                  isRequired
                  label={t`Average delivery time`}
                  placeholder={t`15-20 days`}
                />
              )}
            </form.AppField>
            <form.AppField name='address'>
              {(field) => (
                <field.Input isRequired label={t`Address`} placeholder={t`Enter company address`} />
              )}
            </form.AppField>
            <form.AppField name='inn'>
              {(field) => (
                <field.Input isRequired label={t`INN`} placeholder={t`Enter company INN`} />
              )}
            </form.AppField>
          </div>
        </article>

        <article className='ring-muted rounded-2xl bg-white p-5 shadow-sm ring-1'>
          <div className='flex items-center justify-between gap-3'>
            <h2 className='text-primary text-lg font-semibold'>{t`Features`}</h2>
            <form.Field name='features' mode='array'>
              {(field) => (
                <Button
                  size='sm'
                  type='button'
                  variant='outline'
                  onClick={() => field.pushValue({ name_en: '', name_uz: '', name_ru: '' })}
                >
                  <PlusIcon className='size-3.5' />
                  {t`Add`}
                </Button>
              )}
            </form.Field>
          </div>
          <form.Field name='features' mode='array'>
            {(field) => (
              <div className='mt-4 space-y-3'>
                {!field.state.value.length && (
                  <p className='text-muted-foreground text-xs'>{t`No features yet.`}</p>
                )}
                {field.state.value.map((_, index) => (
                  <div key={index} className='rounded-xl border border-slate-200 p-3'>
                    <div className='grid gap-3 sm:grid-cols-3'>
                      <form.AppField name={`features.${index}.name_uz` as never}>
                        {(featureField) => (
                          <featureField.Input
                            isRequired
                            label={`${t`Feature`} (Uz)`}
                            placeholder={t`Feature name`}
                          />
                        )}
                      </form.AppField>
                      <form.AppField name={`features.${index}.name_ru` as never}>
                        {(featureField) => (
                          <featureField.Input
                            isRequired
                            label={`${t`Feature`} (Ru)`}
                            placeholder={t`Feature name`}
                          />
                        )}
                      </form.AppField>
                      <form.AppField name={`features.${index}.name_en` as never}>
                        {(featureField) => (
                          <featureField.Input
                            isRequired
                            label={`${t`Feature`} (En)`}
                            placeholder={t`Feature name`}
                          />
                        )}
                      </form.AppField>
                    </div>
                    <div className='mt-3 flex justify-end'>
                      <Button
                        size='sm'
                        type='button'
                        variant='destructive'
                        onClick={() => field.removeValue(index)}
                      >
                        <Trash2Icon className='size-3.5' />
                        {t`Remove`}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </form.Field>
        </article>
        <article className='ring-muted rounded-2xl bg-white p-5 shadow-sm ring-1'>
          <h2 className='text-primary text-lg font-semibold'>{t`Social links`}</h2>
          <div className='mt-4 grid gap-3 sm:grid-cols-2'>
            <form.AppField name='youtube'>
              {(field) => (
                <field.Input label='YouTube' placeholder='https://youtube.com/@channel' />
              )}
            </form.AppField>
            <form.AppField name='telegram'>
              {(field) => <field.Input label='Telegram' placeholder='https://t.me/username' />}
            </form.AppField>
            <form.AppField name='instagram'>
              {(field) => (
                <field.Input label='Instagram' placeholder='https://instagram.com/username' />
              )}
            </form.AppField>
            <form.AppField name='facebook'>
              {(field) => <field.Input label='Facebook' placeholder='https://facebook.com/page' />}
            </form.AppField>
            <form.AppField name='whatsapp'>
              {(field) => <field.Input label='WhatsApp' placeholder='https://wa.me/998901234567' />}
            </form.AppField>
            <form.AppField name='own_site'>
              {(field) => <field.Input label={t`Website`} placeholder='https://example.com' />}
            </form.AppField>
          </div>
        </article>
      </form>
    </form.AppForm>
  );
};
