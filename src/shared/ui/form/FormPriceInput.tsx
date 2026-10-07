import React from 'react';

import type { FormControlProps } from './FormBase.tsx';

import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '../input-group.tsx';
import { FormBase } from './FormBase.tsx';
import { useFieldContext } from './hooks.ts';

type FormPriceInputProps = FormControlProps & {
  currency?: string;
  placeholder?: string;
} & Omit<React.ComponentProps<typeof InputGroupInput>, 'onBlur' | 'onChange' | 'value'>;

export const FormPriceInput = ({
  label,
  description,
  isRequired,
  currency,
  placeholder = '0.00',
  ...inputProps
}: FormPriceInputProps) => {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  const rawValue = field.state.value ?? '';

  // Format only when blurred (add spaces)
  const formatNumber = (val: string) => val.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  const displayValue = formatNumber(rawValue);

  // Core cleanup logic (reusable)
  const cleanValue = (val: string) => {
    // remove invalid chars
    val = val.replace(/[^0-9.]/g, '');

    // allow only ONE dot
    const firstDot = val.indexOf('.');
    if (firstDot !== -1) {
      const nextDots = val.substring(firstDot + 1).replace(/\./g, '');
      val = val.substring(0, firstDot + 1) + nextDots;
    }

    // limit decimals to 2
    const [int, dec] = val.split('.');
    if (dec !== undefined) {
      val = `${int}.${dec.slice(0, 2)}`;
    }

    return val;
  };

  return (
    <FormBase isRequired={isRequired} label={label} description={description}>
      <InputGroup>
        <InputGroupInput
          {...inputProps}
          aria-invalid={isInvalid}
          id={field.name}
          name={field.name}
          type='text'
          value={displayValue}
          inputMode='decimal'
          onBlur={() => {
            const cleaned = cleanValue(rawValue);
            field.handleChange(cleaned);
            field.handleBlur();
          }}
          onChange={(e) => {
            const cleaned = cleanValue(e.target.value);
            field.handleChange(cleaned);
          }}
          placeholder={placeholder}
        />
        {currency && (
          <InputGroupAddon align='inline-end'>
            <InputGroupText>{currency}</InputGroupText>
          </InputGroupAddon>
        )}
      </InputGroup>
    </FormBase>
  );
};
