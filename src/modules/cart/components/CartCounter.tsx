import { useLingui } from '@lingui/react/macro';
import { InfoIcon, MinusIcon, PlusIcon } from 'lucide-react';
import React from 'react';

import { useDebouncedValue } from '@/shared/hooks/useDeboucedValue.ts';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { ButtonGroup } from '@/shared/ui/button-group.tsx';

interface Props extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  disabled?: boolean;
  maxValue: number;
  minValue?: number;
  value: number;
  onChange: (value: number) => void;
}

export const CartCounter = ({
  value,
  onChange,
  maxValue,
  minValue = 0,
  className,
  disabled,
  ...props
}: Props) => {
  const { t } = useLingui();
  const [inputValue, setInputValue] = React.useState<string>(value.toString());
  const [buttonValue, setButtonValue] = React.useState<number>(value);

  const debouncedButtonValue = useDebouncedValue(buttonValue);

  React.useEffect(() => {
    setInputValue(value.toString());
    setButtonValue(value);
  }, [value]);

  // Update from button click (debounced)
  React.useEffect(() => {
    if (!Number.isNaN(debouncedButtonValue)) {
      if (Number(inputValue) !== value) onChange(debouncedButtonValue);
    }
  }, [debouncedButtonValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (/^\d*$/.test(newValue)) {
      setInputValue(newValue);
    }
  };

  const onBlur = () => {
    const parsed = Number.parseInt(inputValue);
    if (Number.isNaN(parsed)) {
      setInputValue(value.toString()); // Revert to current value
    } else {
      const clamped = Math.max(minValue, Math.min(parsed, maxValue));
      setInputValue(clamped.toString());
      if (Number(inputValue) !== value) onChange(clamped); // Immediate update on blur
    }
  };

  const onDecrement = () => {
    const parsed = Number.parseInt(inputValue) || value;
    const next = Math.max(minValue, parsed - 1);
    setInputValue(next.toString());
    setButtonValue(next);
  };

  const onIncrement = () => {
    const parsed = Number.parseInt(inputValue) || value;
    const next = Math.min(maxValue, parsed + 1);
    setInputValue(next.toString());
    setButtonValue(next);
  };

  const numericValue = Number.parseInt(inputValue);

  return (
    <ButtonGroup
      className={cn('bg-secondary relative rounded-md', disabled && 'opacity-50', className)}
      {...props}
    >
      <Button
        disabled={disabled || numericValue <= minValue}
        size='icon'
        variant='ghost'
        onClick={onDecrement}
      >
        <MinusIcon />
      </Button>
      <input
        className='w-full text-center outline-none disabled:bg-transparent'
        disabled={disabled}
        value={inputValue}
        autoComplete='off'
        inputMode='decimal'
        onBlur={onBlur}
        onChange={handleChange}
        onFocus={(e) => e.target.select()}
      />
      {numericValue > maxValue && (
        <div className='bg-background/70 text-destructive absolute top-full right-1 z-2 flex items-center gap-1 text-xs'>
          <InfoIcon className='size-3' />
          {t`Only ${maxValue} left`}
        </div>
      )}
      <Button
        disabled={disabled || numericValue >= maxValue}
        size='icon'
        variant='ghost'
        onClick={onIncrement}
      >
        <PlusIcon />
      </Button>
    </ButtonGroup>
  );
};
