import { CartItemRow } from './CartItemRow';

interface Props {
  items: CartItem[];
}

export const CartItems = ({ items }: Props) => (
  <div className='space-y-3'>
    {items.map((item) => (
      <CartItemRow key={item.id} item={item} />
    ))}
  </div>
);
