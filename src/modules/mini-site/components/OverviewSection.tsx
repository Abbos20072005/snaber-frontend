import { useLingui } from '@lingui/react/macro';
import { CircleCheckBigIcon } from 'lucide-react';

import { Badge } from '@/shared/ui/badge';

interface Props {
  miniSite: MiniSite;
}

export const OverviewSection = ({ miniSite }: Props) => {
  const features = miniSite.features.filter(Boolean).map((features) => features.name);
  const industries = miniSite.industries.map((industry) => industry.name);
  const { t } = useLingui();

  return (
    <section>
      <div className='ring-muted rounded-2xl p-5 shadow-sm ring-1'>
        <h2 className='text-primary text-lg font-semibold'>{t`Company profile`}</h2>
        <p className='mt-2 text-sm leading-relaxed text-slate-600'>
          {miniSite.description || t`No company description provided.`}
        </p>
        {features.length > 0 && (
          <>
            <h2 className='text-primary mt-4 text-lg font-semibold'>{t`Company features`}</h2>
            <div className='mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2'>
              {features.map((column) => (
                <div
                  key={column}
                  className='rounded-xl border bg-[linear-gradient(145deg,white_0%,var(--primary)_500%)] p-2'
                >
                  <li className='text-primary inline-flex items-start gap-2 text-xs'>
                    <CircleCheckBigIcon className='mt-0.5 size-3.5 shrink-0' />
                    <span>{column}</span>
                  </li>
                </div>
              ))}
            </div>
          </>
        )}

        {industries.length > 0 && (
          <>
            <h2 className='text-primary mt-4 text-lg font-semibold'>{t`Company industries`}</h2>
            <div className='mt-2 flex flex-wrap gap-3'>
              {industries.map(
                (column) => column.length > 0 && <Badge key={column}>{column}</Badge>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
