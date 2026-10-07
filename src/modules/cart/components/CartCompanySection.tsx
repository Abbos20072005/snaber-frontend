import { CartItemRow } from './CartItemRow';

interface Props {
  cart: Cart;
}

export const CartCompanySection = ({ cart }: Props) => (
  <div className='space-y-3'>
    {cart.items.map((item) => (
      <CartItemRow key={item.id} item={item} />
    ))}
  </div>
);
