import { useLingui } from '@lingui/react/macro';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { postAboutInfo } from '@/shared/api/requests/about';
import { localeOptions } from '@/shared/i18n/constants';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { SimpleEditor } from '@/shared/ui/tiptap-editor/simple/simple-editor';

import { ABOUT_QUERY_KEYS, getAboutInfoOptions } from '../options';

export const RichTextTabs = () => {
  const { t } = useLingui();
  const aboutInfoQuery = useSuspenseQuery(getAboutInfoOptions());
  const aboutInfo = aboutInfoQuery.data;

  const [about, setAbout] = useState<Omit<About, 'information'>>({
    information_en: aboutInfo.information_en,
    information_ru: aboutInfo.information_ru,
    information_uz: aboutInfo.information_uz
  });

  const postAboutMutation = useMutation({
    mutationFn: postAboutInfo,
    onSuccess: () => {
      toast.success(t`Your request has been sent successfully!`);
    },
    meta: {
      invalidatesQuery: ABOUT_QUERY_KEYS.base()
    }
  });

  const publishAboutHandle = () => postAboutMutation.mutate({ data: about });

  return (
    <Tabs className='flex-1'>
      <div className='flex justify-between gap-10'>
        <TabsList>
          {localeOptions.map((item) => (
            <TabsTrigger key={item.value} value={item.value}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <Button
          disabled={postAboutMutation.isPending}
          loading={postAboutMutation.isPending}
          onClick={publishAboutHandle}
        >{t`Publish`}</Button>
      </div>

      {localeOptions.map((item) => (
        <TabsContent key={item.value} value={item.value}>
          <SimpleEditor
            content={about[`information_${item.value}`]}
            onChange={(html) =>
              setAbout((prev) => ({
                ...prev,
                [`information_${item.value}`]: html
              }))
            }
          />
        </TabsContent>
      ))}
    </Tabs>
  );
};
