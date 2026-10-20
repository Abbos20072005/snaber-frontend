import { useLingui } from '@lingui/react/macro';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'sonner';

import { postLegalInfo } from '@/shared/api/requests/legal';
import { localeOptions } from '@/shared/i18n/constants';
import { Button } from '@/shared/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { SimpleEditor } from '@/shared/ui/tiptap-editor/simple/simple-editor';

import { getLegalInfoOptions, LEGAL_QUERY_KEYS } from '../options';

export const LegalRichTextTabs = () => {
  const { t } = useLingui();
  const legalInfoQuery = useSuspenseQuery(getLegalInfoOptions());
  const legalInfo = legalInfoQuery.data;

  const [legal, setLegal] = useState<Omit<Legal, 'information'>>({
    information_en: legalInfo.information_en,
    information_ru: legalInfo.information_ru,
    information_uz: legalInfo.information_uz
  });

  const postLegalMutation = useMutation({
    mutationFn: postLegalInfo,
    onSuccess: () => {
      toast.success(t`Your request has been sent successfully!`);
    },
    meta: {
      invalidatesQuery: LEGAL_QUERY_KEYS.base()
    }
  });

  const publishLegalHandle = () => postLegalMutation.mutate({ data: legal });

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
          disabled={postLegalMutation.isPending}
          loading={postLegalMutation.isPending}
          onClick={publishLegalHandle}
        >{t`Publish`}</Button>
      </div>

      {localeOptions.map((item) => (
        <TabsContent key={item.value} value={item.value}>
          <SimpleEditor
            content={legal[`information_${item.value}`]}
            onChange={(html) =>
              setLegal((prev) => ({
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
