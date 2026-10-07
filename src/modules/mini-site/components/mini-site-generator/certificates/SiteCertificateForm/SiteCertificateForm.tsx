import { useLingui } from '@lingui/react/macro';

import type { SiteCertificateSchemaForm } from '@/modules/mini-site';

import { siteCertificateSchemaForm } from '@/modules/mini-site';
import { useFileFetcher } from '@/shared/hooks/use-file-fetcher';
import { useAppForm } from '@/shared/ui/form/hooks';

interface Props {
  defaultValues?: Partial<Certificate>;
  onSubmit: (values: SiteCertificateSchemaForm) => void;
}

export const SiteCertificateForm = ({ defaultValues, onSubmit }: Props) => {
  const { t } = useLingui();
  const { files } = useFileFetcher({
    links: [defaultValues?.file],
    enabled: !!defaultValues?.file
  });

  const form = useAppForm({
    validators: {
      onChange: siteCertificateSchemaForm()
    },
    onSubmit: ({ value }) => onSubmit(value),
    defaultValues: {
      file: files || [],
      earned_at: defaultValues?.earned_at || '',
      title: defaultValues?.title || ''
    } satisfies SiteCertificateSchemaForm as SiteCertificateSchemaForm
  });

  return (
    <form.AppForm>
      <form
        className='space-y-2'
        id='site-certificate-form'
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <form.AppField name='title'>
          {(field) => (
            <field.Input
              isRequired
              label={t`Certificate name`}
              placeholder={t`Enter certificate name`}
            />
          )}
        </form.AppField>
        <form.AppField name='earned_at'>
          {(field) => (
            <field.DatePicker isRequired label={t`Issued at`} placeholder={t`Select issued date`} />
          )}
        </form.AppField>
        <form.AppField name='file'>
          {(field) => <field.FileUpload accept='.pdf' label={t`Certificate file`} maxFiles={1} />}
        </form.AppField>
      </form>
    </form.AppForm>
  );
};
