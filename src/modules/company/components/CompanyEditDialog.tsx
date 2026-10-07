import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { statusLabelOptions } from '@/modules/draft';
import { patchCompanyDraft } from '@/shared/api/requests/company';
import { Button } from '@/shared/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/shared/ui/dialog';
import { FieldGroup } from '@/shared/ui/field';
import { useAppForm } from '@/shared/ui/form/hooks';
import { SelectItem } from '@/shared/ui/select';

import type { CompanyFormSchema } from '../constants';

import { companyFormSchema } from '../constants';
import { COMPANY_QUERY_KEYS } from '../options';

interface Props {
  company: CompanyDraft;
  openEditDialog: boolean;
  setOpenEditDialog: (value: boolean) => void;
}

export const CompanyEditDialog = ({ company, setOpenEditDialog, openEditDialog }: Props) => {
  const { t } = useLingui();

  const companyPatchMutation = useMutation({
    mutationFn: patchCompanyDraft,
    onSuccess: () => {
      setOpenEditDialog(false);
      toast.success(t`Successfully updated.`);
    },
    meta: {
      invalidatesQuery: COMPANY_QUERY_KEYS.base()
    }
  });

  const form = useAppForm({
    validators: {
      onChange: companyFormSchema()
    },
    defaultValues: {
      status: company.status,
      description_moderator: company.description_moderator
    } satisfies CompanyFormSchema as CompanyFormSchema,
    onSubmit: ({ value }) => {
      const data = { ...value };
      companyPatchMutation.mutate({
        id: company.id,
        data
      });
    }
  });

  return (
    <Dialog onOpenChange={setOpenEditDialog} open={openEditDialog}>
      <DialogContent className='sm:max-w-sm'>
        <DialogHeader>
          <DialogTitle>{t`Edit company`}</DialogTitle>
          <DialogDescription>{t`Select the company status and leave a comment`}</DialogDescription>
        </DialogHeader>
        <form.AppForm>
          <form
            id='company-draft-form'
            onSubmit={(event) => {
              event.stopPropagation();
              event.preventDefault();
              void form.handleSubmit();
            }}
          >
            <FieldGroup>
              <form.AppField name='status'>
                {(filed) => (
                  <filed.Select
                    isRequired
                    items={statusLabelOptions.map((item) => ({
                      label: t(item.label),
                      value: item.value
                    }))}
                    label={t`Select`}
                    placeholder={t`Select status`}
                  >
                    {statusLabelOptions.map(({ label, value }) => (
                      <SelectItem key={value} value={value}>
                        {t(label)}
                      </SelectItem>
                    ))}
                  </filed.Select>
                )}
              </form.AppField>
              <form.AppField name='description_moderator'>
                {(field) => (
                  <field.Textarea
                    isRequired
                    label={t`Description moderator`}
                    placeholder={t`Enter Description`}
                  />
                )}
              </form.AppField>
            </FieldGroup>
          </form>
        </form.AppForm>
        <DialogFooter>
          <DialogClose render={<Button variant='outline'>{t`Cancel`}</Button>} />
          <Button
            type='submit'
            form='company-draft-form'
            loading={companyPatchMutation.isPending}
          >{t`Save changes`}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
