import { useLingui } from '@lingui/react/macro';
import { addDays } from 'date-fns';

import { useCartItem } from '@/modules/cart/hooks/useCartItem.ts';
import { useRfqSelection } from '@/modules/cart/hooks/useRfqSelection.ts';
import { formatDateToString } from '@/shared/lib/format.ts';
import { useCartStore } from '@/shared/store';
import { Button } from '@/shared/ui/button.tsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/shared/ui/dialog.tsx';

import { RfqAttributeSelector } from './rfq-dialog/RfqAttributeSelector.tsx';
import { RfqDeadlinePicker } from './rfq-dialog/RfqDeadlinePicker.tsx';
import { RfqDialogFooter } from './rfq-dialog/RfqDialogFooter.tsx';
import { RfqVariantSelector } from './rfq-dialog/RfqVariantSelector.tsx';

interface Props {
  product: PublicProduct;
}

export const RfqCartButton = ({ product }: Props) => {
  const { t } = useLingui();

  const { selectedVariant, onVariantChange, attributes, setAttributes, isValid } =
    useRfqSelection(product);

  const { getRfqCartItem } = useCartStore();
  const currentCartItem = getRfqCartItem(product.company.id, selectedVariant.id, attributes);

  const { state, functions } = useCartItem(product.company, selectedVariant, {
    type: 'rfq',
    attributes,
    deadline: currentCartItem?.deadline ?? formatDateToString(addDays(new Date(), 1))
  });

  return (
    <Dialog>
      <DialogTrigger render={<Button className='w-full'>{t`Made to order`}</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t`Made to order`}</DialogTitle>
        </DialogHeader>

        <RfqVariantSelector
          selectedVariant={selectedVariant}
          setSelectedVariant={onVariantChange}
          variants={product.variants}
        />

        <RfqAttributeSelector
          attributes={attributes}
          variant={selectedVariant}
          onAttributesChange={setAttributes}
        />

        {currentCartItem?.deadline && (
          <RfqDeadlinePicker
            deadline={new Date(currentCartItem.deadline)}
            onDeadlineChange={(d) => d && functions.onDeadlineChange(formatDateToString(d))}
          />
        )}

        <RfqDialogFooter
          isValid={isValid}
          cartCount={state.cartCount}
          companyId={product.company.id}
          onAddToCart={functions.onAddToCart}
          onCartCountChange={functions.onCartCountChange}
        />
      </DialogContent>
    </Dialog>
  );
};
