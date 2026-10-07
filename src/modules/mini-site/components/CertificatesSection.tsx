import { useLingui } from '@lingui/react/macro';
import { ShieldCheck } from 'lucide-react';

import { CertificateViewer } from './CertificateViewer';

interface Props {
  certificates: Certificate[];
}

export const CertificatesSection = ({ certificates }: Props) => {
  const { t } = useLingui();

  return (
    <section className='space-y-4'>
      <article className='ring-muted rounded-2xl bg-white p-5 shadow-sm ring-1'>
        <h2 className='text-primary text-lg font-semibold'>{t`Certificates`}</h2>
        <div className='mt-4 grid gap-3 sm:grid-cols-2'>
          {certificates.map((certificate, index) => (
            <div
              key={certificate.id}
              className='rounded-xl border border-slate-200 bg-slate-50 p-3'
            >
              <div className='relative overflow-hidden rounded-lg border border-slate-200 bg-white p-4'>
                <div className='bg-primary/85 absolute top-0 bottom-0 left-0 w-2' />
                <div className='text-primary absolute top-3 right-3 inline-flex size-7 items-center justify-center rounded-full border'>
                  <ShieldCheck className='size-3.5' />
                </div>
                <p className='text-primary pl-4 text-xl font-semibold tracking-tight'>
                  {certificate.title}
                </p>
                <div className='text-muted-foreground mt-3 pl-4 text-[11px] leading-5'>
                  <p>
                    {t`Certificate No`}: CERT-{String(certificate.id || index + 1).padStart(5, '0')}
                  </p>
                  <p>
                    {t`Issued at`}: {certificate.earned_at || '-'}
                  </p>
                </div>
              </div>
              <div className='mt-3 space-y-1'>
                <h3 className='text-primary text-sm font-semibold'>{certificate.title}</h3>
                <p className='text-muted-foreground text-xs'>
                  {t`Issued at`}: {certificate.earned_at || '-'}
                </p>
              </div>
              {certificate.file && (
                <CertificateViewer file={certificate.file} title={certificate.title} />
              )}
            </div>
          ))}
          {certificates.length === 0 && (
            <p className='text-muted-foreground text-sm'>{t`Certificates not found`}</p>
          )}
        </div>
      </article>
    </section>
  );
};
