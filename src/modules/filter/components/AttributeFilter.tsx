import { parseAsArrayOf, parseAsInteger, useQueryState } from 'nuqs';

import { cn } from '@/shared/lib/utils';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/shared/ui/accordion';

const AttributeValueItem = ({
  val,
  isChecked,
  onChange
}: {
  val: { id: number; value: string; image?: string | null };
  isChecked: boolean;
  onChange: (checked: boolean) => void;
}) => {
  if (val.image) {
    return (
      <div className='flex items-center gap-4'>
        <button
          className={`h-14 overflow-hidden rounded-md border-2 transition-colors ${
            isChecked ? 'border-primary' : 'border-transparent'
          }`}
          type='button'
          onClick={() => onChange(!isChecked)}
        >
          <img alt={val.value} className='h-full w-14 object-cover' src={val.image} />
        </button>
        <input checked={isChecked} type='checkbox' onChange={(e) => onChange(e.target.checked)} />
        <span className='text-sm'>{val.value}</span>
      </div>
    );
  }

  return (
    <label className='flex cursor-pointer items-center gap-2'>
      <input checked={isChecked} type='checkbox' onChange={(e) => onChange(e.target.checked)} />
      <span className='text-sm'>{val.value}</span>
    </label>
  );
};

interface Props {
  filters: FilterResponse;
}

export const AttributeFilter = ({ filters }: Props) => {
  const [selected, setSelected] = useQueryState(
    'values',
    parseAsArrayOf(parseAsInteger, ',').withDefault([])
  );

  const handleChange = (valueId: number, checked: boolean) => {
    setSelected((prev) => (checked ? [...prev, valueId] : prev.filter((id) => id !== valueId)));
  };

  const attributes = filters?.attributes.filter((attr) => attr.values.length > 0);

  return (
    <Accordion>
      {attributes?.map((attribute) => (
        <AccordionItem key={attribute.id}>
          <AccordionTrigger className='mb-2 text-sm font-medium'>{attribute.name}</AccordionTrigger>

          <AccordionContent className={cn('flex flex-col gap-3')}>
            {attribute.values.map((val) => {
              const isChecked = selected.includes(val.id);

              return (
                <AttributeValueItem
                  key={val.id}
                  isChecked={isChecked}
                  val={val}
                  onChange={(checked) => handleChange(val.id, checked)}
                />
              );
            })}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
