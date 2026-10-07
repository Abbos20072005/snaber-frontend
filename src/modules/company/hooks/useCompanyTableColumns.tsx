import type { ColumnDef } from '@tanstack/react-table';

import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { EditIcon, LinkIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { statusColorMap, statusLabelMap, statusLabelOptions } from '@/modules/draft';
import { deleteCompany } from '@/shared/api/requests/company';
import useFancybox from '@/shared/hooks/useFancybox';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { DeleteAlertDialog } from '@/shared/ui/delete-alert-dialog';

import { CompanyEditDialog } from '../components/CompanyEditDialog';
import { CompanyPopover } from '../components/CompanyPopover';
import { companySortLabelMap, companySortLabelOptions } from '../constants';
import { COMPANY_QUERY_KEYS } from '../options';

const CompanyCell = ({ company }: { company: CompanyDraft }) => {
  const { fancyboxRef } = useFancybox();

  return (
    <div ref={fancyboxRef} className='flex min-w-60 items-center gap-3'>
      {company.logo ? (
        <a
          href={company.logo}
          aria-label={company.name}
          data-caption={company.name}
          data-fancybox={`company-${company.id}`}
          onClick={(event) => event.stopPropagation()}
        >
          <img
            alt={company.name}
            className='size-10 rounded-md border object-cover'
            src={company.logo}
          />
        </a>
      ) : (
        <div className='bg-sidebar-accent flex size-10 items-center justify-center rounded-md'>
          <p className='uppercase'>{company.name[0]}</p>
        </div>
      )}
      <div className='font-medium'>{company.name}</div>
    </div>
  );
};

export const useCompanyTableColumns = (): ColumnDef<CompanyDraft>[] => {
  const { t } = useLingui();

  return [
    {
      id: 'search',
      accessorKey: 'name',
      header: t`Company`,
      cell: ({ row }) => {
        const company = row.original;
        return <CompanyCell company={company} />;
      },
      meta: {
        variant: 'text',
        placeholder: t`Search company`
      },
      enableColumnFilter: true
    },
    {
      id: 'sort',
      accessorKey: 'region',
      header: t`Region`,
      cell: ({ row }) => <span className='font-mono text-xs'>{row.original.region.name}</span>,
      meta: {
        variant: 'select',
        label: t`Sort`,
        options: companySortLabelOptions.map((item) => ({
          label: t(companySortLabelMap[item.value]),
          value: item.value
        }))
      },
      enableColumnFilter: true
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: t`Status`,
      cell: ({ row }) => (
        <Badge
          style={{
            backgroundColor: `${statusColorMap[row.original.status]}20`,
            color: `${statusColorMap[row.original.status]}`
          }}
          className={cn('font-mono text-xs')}
        >
          {t(statusLabelMap[row.original.status])}
        </Badge>
      ),
      meta: {
        variant: 'select',
        label: t`Status`,
        options: statusLabelOptions.map((item) => ({
          label: t(statusLabelMap[item.value]),
          value: item.value
        }))
      },
      enableColumnFilter: true
    },
    {
      accessorKey: 'industries',
      header: t`Industries`,
      cell: ({ row }) => (
        <div className='flex gap-2 space-y-1'>
          {row.original.industries.length > 0
            ? row.original.industries.map((item) => (
                <Badge key={item.id} variant={'secondary'}>
                  {item.name}
                </Badge>
              ))
            : '-'}
        </div>
      )
    },
    {
      accessorKey: 'description_moderator',
      header: t`Moderator description`,
      cell: ({ row }) => (
        <p className='w-100 truncate font-mono text-xs'>
          {row.original.description_moderator || '-'}
        </p>
      )
    },
    {
      accessorKey: 'actions',
      size: 32,
      cell: function Cell({ row }) {
        const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
        const [openDeleteAlert, setDeleteAlert] = useState<boolean>(false);

        const deleteCompanyMutation = useMutation({
          mutationFn: () => deleteCompany({ id: row.original.id }),
          onSuccess: () => toast.success(t`Successfully deleted company`),
          meta: {
            invalidatesQuery: [...COMPANY_QUERY_KEYS.base()]
          }
        });

        return (
          <>
            <div className='flex items-center gap-4'>
              <CompanyPopover socialLinks={row.original.contacts}>
                <Button className='cursor-pointer' size={'icon-sm'} variant={'outline'}>
                  <LinkIcon />
                </Button>
              </CompanyPopover>
              <Button
                className='cursor-pointer'
                size={'icon-sm'}
                variant={'outline'}
                onClick={() => setOpenEditDialog(true)}
              >
                <EditIcon />
              </Button>
              <Button
                className='cursor-pointer'
                size={'icon-sm'}
                variant={'destructive'}
                onClick={() => {
                  setDeleteAlert(true);
                }}
              >
                <Trash2Icon />
              </Button>
            </div>
            <DeleteAlertDialog
              title={t`Delete this company?`}
              description={t`Are you sure you want to delete this company? This action cannot be undone.`}
              isLoading={deleteCompanyMutation.isPending}
              onDelete={() => deleteCompanyMutation.mutate}
              onOpenChange={setDeleteAlert}
              open={openDeleteAlert}
            />
            <CompanyEditDialog
              company={row.original}
              openEditDialog={openEditDialog}
              setOpenEditDialog={setOpenEditDialog}
            />
          </>
        );
      }
    }
  ];
};
