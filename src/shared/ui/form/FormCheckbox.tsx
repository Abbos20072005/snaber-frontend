import type { FormControlProps } from './FormBase.tsx';

import { Checkbox } from '../checkbox.tsx';
import { FormBase } from './FormBase.tsx';
import { useFieldContext } from './hooks.ts';

export const FormCheckbox = (props: FormControlProps) => {
  const field = useFieldContext<boolean>();
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

  return (
    <FormBase {...props} controlFirst horizontal>
      <Checkbox
        aria-invalid={isInvalid}
        checked={field.state.value}
        id={field.name}
        name={field.name}
        onBlur={field.handleBlur}
        onCheckedChange={(e) => field.handleChange(e === true)}
      />
    </FormBase>
  );
};
