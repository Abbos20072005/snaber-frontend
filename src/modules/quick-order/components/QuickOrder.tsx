import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { useQueryState } from 'nuqs';
import { useState } from 'react';
import { toast } from 'sonner';

import { postQuickOrderMatch } from '@/shared/api';
import { toFormData } from '@/shared/lib/form-data';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card';
import { useAppForm } from '@/shared/ui/form/hooks';

import type { QuickOrderFormSchema } from '../constants';
import type { QuickOrderRow } from './QuickOrderReview';

import { quickOrderFormSchema } from '../constants';
import { QuickOrderReview } from './QuickOrderReview';
import { RequestForm } from './RequestForm';

export const QuickOrder = () => {
  const { t } = useLingui();
  const [text] = useQueryState('text', { defaultValue: '' });
  const [rows, setRows] = useState<QuickOrderRow[]>([]);

  const matchMutation = useMutation({
    mutationFn: postQuickOrderMatch,
    onSuccess: ({ data }) =>
      setRows(
        data.map((line) => ({
          name: line.name,
          quantity: line.quantity,
          matches: line.matches,
          productId: line.matches[0]?.id ?? null
        }))
      ),
    onError: () => toast.error(t`Failed to read the list. Check the file and try again.`)
  });

  const form = useAppForm({
    validators: {
      onChange: quickOrderFormSchema()
    },
    defaultValues: {
      text,
      file: []
    } satisfies QuickOrderFormSchema as QuickOrderFormSchema,
    onSubmit: ({ value }) =>
      matchMutation.mutate({
        data: toFormData(value.text.trim() ? { text: value.text } : { file: value.file[0] })
      })
  });

  const notFoundItems = rows
    .filter((row) => row.productId === null && row.name.trim())
    .map((row) => ({ name: row.name, quantity: row.quantity }));

  return (
    <div className='mx-auto w-full max-w-4xl space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>{t`Your list`}</CardTitle>
          <CardDescription>
            {t`Write one product per line with its quantity, for example "Cement M400 - 20", or upload an Excel or CSV file.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form.AppForm>
            <form
              className='grid gap-4'
              onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();
                void form.handleSubmit();
              }}
            >
              <form.AppField name='text'>
                {(field) => (
                  <field.Textarea
                    label={t`List`}
                    placeholder={
                      'Portland cement M400 - 20\nPower cable 3x2.5 - 100\nBall bearing 6204 - 8'
                    }
                    rows={6}
                  />
                )}
              </form.AppField>
              <form.AppField name='file'>
                {(field) => (
                  <field.FileUpload
                    accept='.xlsx,.csv'
                    label={t`Excel or CSV file`}
                    maxFiles={1}
                    uploadHint={t`The first column is the product, the second is the quantity`}
                  />
                )}
              </form.AppField>
              <div className='ml-auto flex flex-wrap gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() =>
                    setRows([...rows, { name: '', quantity: 1, matches: [], productId: null }])
                  }
                >
                  <PlusIcon />
                  {t`Add own product`}
                </Button>
                <Button type='submit' loading={matchMutation.isPending}>
                  {t`Find products`}
                </Button>
              </div>
            </form>
          </form.AppForm>
        </CardContent>
      </Card>

      {rows.length > 0 && <QuickOrderReview onChange={setRows} rows={rows} />}

      <RequestForm items={notFoundItems} />
    </div>
  );
};
