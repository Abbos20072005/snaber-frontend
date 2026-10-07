import type { ReactNode } from 'react';

import React from 'react';

import type { FormControlProps } from './FormBase';

import { Select, SelectContent, SelectGroup, SelectTrigger, SelectValue } from '../select';
import { FormBase } from './FormBase';
import { useFieldContext } from './hooks';

interface Props extends FormControlProps, React.ComponentProps<typeof Select> {
  children: ReactNode;
  placeholder?: string;
  renderValue?: (value: string) => ReactNode;
}

export const FormSelect = ({
  children,
  label,
  isRequired,
  description,
  renderValue,
  placeholder,
  ...props
}: Props) => {
  const field = useFieldContext<string>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase isRequired={isRequired} label={label} description={description}>
      <Select
        value={field.state.value}
        onValueChange={(value) => field.handleChange((value as string) ?? '')}
        {...props}
      >
        <SelectTrigger aria-invalid={isInvalid} id={field.name} onBlur={field.handleBlur}>
          <SelectValue placeholder={placeholder}>
            {field.state.value && renderValue ? renderValue(field.state.value) : undefined}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>{children}</SelectGroup>
        </SelectContent>
      </Select>
    </FormBase>
  );
};
