interface Props {
  items: ProductRequest['items'];
}

export const ProductRequestItems = ({ items }: Props) => (
  <ul className='space-y-1 text-sm'>
    {items.map((item, index) => (
      <li key={`${item.name}-${index}`}>
        {item.name} <span className='text-muted-foreground'>× {item.quantity}</span>
      </li>
    ))}
  </ul>
);
