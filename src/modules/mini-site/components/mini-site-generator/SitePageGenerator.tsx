import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { parseAsString, useQueryState } from 'nuqs';
import { Activity } from 'react';
import { toast } from 'sonner';

import type { SiteGeneratorSchemaForm } from '@/modules/mini-site';

import { CompanyMembersTable, MINI_SITE_QUERY_KEYS } from '@/modules/company';
import { SiteCertificateSection, SiteGallerySection, SiteGeneratorForm } from '@/modules/mini-site';
import { patchMiniSite, postMiniSite } from '@/shared/api';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';

type TabKey = 'certificates' | 'members' | 'overview' | 'photos';

const createMiniSiteFormData = (values: SiteGeneratorSchemaForm) => {
  const formData = new FormData();

  formData.append('name_uz', values.name_uz);
  formData.append('name_ru', values.name_ru);
  formData.append('name_en', values.name_en);
  formData.append('description_uz', values.description_uz);
  formData.append('description_ru', values.description_ru);
  formData.append('description_en', values.description_en);
  formData.append('status', values.status);
  formData.append('phone', values.phone);
  formData.append('email', values.email);
  formData.append('telegram', values.telegram || '');
  formData.append('youtube', values.youtube || '');
  formData.append('instagram', values.instagram || '');
  formData.append('facebook', values.facebook || '');
  formData.append('whatsapp', values.whatsapp || '');
  formData.append('own_site', values.own_site || '');
  formData.append('avg_answer_time', values.avg_answer_time);
  formData.append('avg_delivery_time', values.avg_delivery_time);
  formData.append('region', values.region.value);
  formData.append('address', values.address);
  formData.append('longitude', values.longitude.toString());
  formData.append('latitude', values.latitude.toString());
  formData.append('inn', values.inn);

  values.industries.forEach((industry) => formData.append('industries', industry));

  values.features.forEach((feature, index) => {
    formData.append(`features[${index}]name_uz`, feature.name_uz);
    formData.append(`features[${index}]name_ru`, feature.name_ru);
    formData.append(`features[${index}]name_en`, feature.name_en);
  });

  if (values.logo[0]) formData.append('logo', values.logo[0]);

  if (values.cover[0]) formData.append('cover', values.cover[0]);

  return formData;
};

interface Props {
  miniSite: MiniSite | undefined;
}

export const SitePageGenerator = ({ miniSite }: Props) => {
  const { t } = useLingui();
  const [activeTab, setActiveTab] = useQueryState('tab', parseAsString.withDefault('overview'));

  const tabs: { key: TabKey; label: string; disabled: boolean }[] = [
    { key: 'overview', label: t`Overview`, disabled: false },
    { key: 'photos', label: t`Factory photos`, disabled: !miniSite },
    { key: 'certificates', label: t`Certificates`, disabled: !miniSite },
    { key: 'members', label: t`Members`, disabled: false }
  ];

  const currentTab: TabKey =
    activeTab === 'certificates' || activeTab === 'photos' || activeTab === 'members'
      ? activeTab
      : 'overview';

  const siteOverviewMutation = useMutation({
    mutationFn: postMiniSite,
    onSuccess: () => {
      toast.success(t`Successfully created the mini site!`);
    },
    onError: () => toast.error(t`Failed to create the mini site. Please try again.`),
    meta: {
      invalidatesQuery: MINI_SITE_QUERY_KEYS.base()
    }
  });

  const siteOverviewPatchMutation = useMutation({
    mutationFn: patchMiniSite,
    onSuccess: () => toast.success(t`Successfully updated the mini site!`),
    onError: () => toast.error(t`Failed to update the mini site. Please try again.`)
  });

  const onSiteOverviewSubmit = (values: SiteGeneratorSchemaForm) => {
    const isEdit = !!miniSite;
    const data = createMiniSiteFormData(values);
    if (isEdit) siteOverviewPatchMutation.mutate({ data, id: miniSite!.id });
    else
      siteOverviewMutation.mutate({
        data
      });
  };

  return (
    <>
      <div className='container space-y-6'>
        <section className='ring-muted rounded-2xl bg-white p-3 shadow-sm ring-1 sm:p-4'>
          {tabs.map((tab) => {
            const isActive = tab.key === currentTab;

            return (
              <Tooltip key={tab.key}>
                <TooltipTrigger>
                  <Button
                    key={tab.key}
                    className={cn(
                      'rounded-b-none! border-b-2 px-3 py-2 text-xs font-medium transition',
                      isActive
                        ? 'border-b-primary text-primary border'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    )}
                    disabled={tab.disabled}
                    type='button'
                    variant='ghost'
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {(() => {
                    const label = tab.label.toLowerCase();
                    return tab.disabled
                      ? t`You need to save the company information first to access this section.`
                      : t`View ${label} section`;
                  })()}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </section>
        <Activity mode={activeTab === 'overview' ? 'visible' : 'hidden'}>
          <SiteGeneratorForm defaultValues={miniSite} onSubmit={onSiteOverviewSubmit} />
        </Activity>
        <Activity mode={activeTab === 'certificates' && !!miniSite ? 'visible' : 'hidden'}>
          {miniSite && <SiteCertificateSection miniSite={miniSite} />}
        </Activity>
        <Activity mode={activeTab === 'photos' && !!miniSite ? 'visible' : 'hidden'}>
          {miniSite && <SiteGallerySection miniSite={miniSite} />}
        </Activity>
        <Activity mode={activeTab === 'members' && !!miniSite ? 'visible' : 'hidden'}>
          <CompanyMembersTable />
        </Activity>
      </div>
    </>
  );
};
