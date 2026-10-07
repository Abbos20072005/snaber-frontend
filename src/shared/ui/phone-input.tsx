import * as React from 'react';

import type { Input } from '@/shared/ui/input.tsx';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText
} from '@/shared/ui/input-group.tsx';

type Props = Omit<React.ComponentProps<typeof Input>, 'onChange' | 'value'> & {
  onChange?: (value: string) => void;
  value?: string;
};

const formatUzbekPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 9);
  if (!digits) return '';
  return [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7)]
    .filter(Boolean)
    .join(' ');
};

const PhoneInput = ({ className, onChange, value, ...props }: Props) => {
  const [internalValue, setInternalValue] = React.useState('');
  const isControlled = value !== undefined;

  const extractDigits = (val: string): string =>
    val
      .replace(/^\+998/, '')
      .replace(/\D/g, '')
      .slice(0, 9);

  const currentDigits = isControlled ? extractDigits(value || '') : internalValue;
  const displayValue = formatUzbekPhone(currentDigits);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 9);
    if (!isControlled) setInternalValue(digits);
    onChange?.(digits ? `+998${digits}` : '');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      ['ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Enter', 'Escape', 'Tab'].includes(
        e.key
      ) ||
      e.ctrlKey ||
      e.metaKey
    )
      return;
    if (!/^\d$/.test(e.key)) e.preventDefault();
  };

  return (
    <InputGroup>
      <InputGroupAddon>
        <InputGroupText>+998</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        type='tel'
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder='XX XXX XX XX'
        {...props}
      />
    </InputGroup>
  );
};
PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };
