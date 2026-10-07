import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { EditIcon, EllipsisVerticalIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { UnitDialog } from '@/modules/unit-of-measure';
import { deleteUnitOfMeasure } from '@/shared/api';
import { Button } from '@/shared/ui/button';
import { DeleteAlertDialog } from '@/shared/ui/delete-alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/ui/dropdown-menu';
import { Item, ItemActions, ItemContent, ItemTitle } from '@/shared/ui/item';

import { UNIT_OF_MEASURES_QUERY_KEYS } from '../options';

interface UnitOfMeasureCardProps {
  unit: UnitOfMeasure;
}

export const UnitOfMeasureCard = ({ unit }: UnitOfMeasureCardProps) => {
  const { t } = useLingui();
  const [openEditDialog, setEditDialog] = useState<boolean>(false);
  const [openDeleteAlert, setDeleteAlert] = useState<boolean>(false);

  const deleteUnitMutation = useMutation({
    mutationFn: deleteUnitOfMeasure,
    onSuccess: () => {
      setDeleteAlert(false);
      toast.success(t`Unit deleted successfully.`);
    },
    onError: () => toast.error(t`Failed to delete unit.`),
    meta: {
      withoutToastOnError: true,
      invalidatesQuery: UNIT_OF_MEASURES_QUERY_KEYS.base()
    }
  });

  return (
    <Item size='xs' variant='outline'>
      <ItemContent>
        <ItemTitle>{unit.unit}</ItemTitle>
      </ItemContent>
      <ItemActions>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button aria-label={t`Actions`} size='icon' variant='ghost'>
                <EllipsisVerticalIcon />
              </Button>
            }
          />
          <DropdownMenuContent align='end' className='w-40'>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setEditDialog(true)}>
                <EditIcon />
                {t`Update`}
              </DropdownMenuItem>
              <DropdownMenuItem variant='destructive' onClick={() => setDeleteAlert(true)}>
                <Trash2Icon />
                {t`Delete`}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ItemActions>
      <DeleteAlertDialog
        itemName={unit.unit}
        title={t`Delete unit`}
        description={t`Are you sure you want to delete this unit? This action cannot be undone.`}
        isLoading={deleteUnitMutation.isPending}
        onDelete={() => deleteUnitMutation.mutate({ id: unit.id })}
        onOpenChange={setDeleteAlert}
        open={openDeleteAlert}
      />
      <UnitDialog editValues={unit} onOpenChange={setEditDialog} open={openEditDialog} />
    </Item>
  );
};
