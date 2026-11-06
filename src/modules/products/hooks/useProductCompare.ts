import { useLingui } from '@lingui/react/macro';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

import { MAX_COMPARE_PER_CATEGORY, useCompareStore } from '@/shared/store';

export const useProductCompare = (product: { category: number; id: number }) => {
  const { t } = useLingui();
  const navigate = useNavigate();
  const isCompared = useCompareStore((state) => state.items.some((item) => item.id === product.id));
  const toggleCompare = useCompareStore((state) => state.toggle);

  const onToggleCompare = () => {
    if (!toggleCompare({ category: product.category, id: product.id })) {
      toast.error(t`You can compare up to ${MAX_COMPARE_PER_CATEGORY} products of one category.`);
      return;
    }
    if (!isCompared)
      toast(t`Added to comparison`, {
        action: { label: t`Compare`, onClick: () => void navigate({ to: '/compare' }) }
      });
  };

  return { isCompared, onToggleCompare };
};
