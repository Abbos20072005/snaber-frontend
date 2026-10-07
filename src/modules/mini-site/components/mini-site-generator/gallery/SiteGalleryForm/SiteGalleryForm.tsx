import { useLingui } from '@lingui/react/macro';

import { useFileFetcher } from '@/shared/hooks/use-file-fetcher';
import { useAppForm } from '@/shared/ui/form/hooks';

import type { SiteGallerySchemaForm } from './constants';

import { siteGallerySchemaForm } from './constants';

interface Props {
  defaultValues?: Partial<Gallery>;
  onSubmit: (value: SiteGallerySchemaForm) => void;
}

export const SiteGalleryForm = ({ defaultValues, onSubmit }: Props) => {
  const { t } = useLingui();

  const form = useAppForm({
    validators: {
      onChange: siteGallerySchemaForm()
    },
    onSubmit: ({ value }) => onSubmit(value),
    defaultValues: {
      image: useFileFetcher({ links: [defaultValues?.image] }).files || [],
      title_uz: defaultValues?.title_uz || '',
      title_en: defaultValues?.title_en || '',
      title_ru: defaultValues?.title_ru || ''
    } satisfies SiteGallerySchemaForm as SiteGallerySchemaForm
  });

  return (
    <form.AppForm>
      <form
        className='space-y-2'
        id='site-gallery-form'
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.AppField name='title_uz'>
          {(titleField) => (
            <titleField.Input isRequired label={`${t`Title`} (Uz)`} placeholder={t`Image title`} />
          )}
        </form.AppField>
        <form.AppField name='title_ru'>
          {(titleField) => (
            <titleField.Input isRequired label={`${t`Title`} (Ru)`} placeholder={t`Image title`} />
          )}
        </form.AppField>
        <form.AppField name='title_en'>
          {(titleField) => (
            <titleField.Input isRequired label={`${t`Title`} (En)`} placeholder={t`Image title`} />
          )}
        </form.AppField>
        <form.AppField name='image'>
          {(fileField) => <fileField.FileUpload accept='image/*' label={t`Image`} maxFiles={1} />}
        </form.AppField>
      </form>
    </form.AppForm>
  );
};
