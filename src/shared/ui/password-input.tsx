import { EyeIcon, EyeOffIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/shared/lib/utils.ts';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput
} from '@/shared/ui/input-group.tsx';

type PasswordInputProps = Omit<React.ComponentProps<typeof InputGroupInput>, 'type'>;

const PasswordInput = ({ ref, className, disabled, ...props }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <InputGroup className={cn('relative rounded-md', className)}>
      <InputGroupInput
        ref={ref}
        disabled={disabled}
        type={showPassword ? 'text' : 'password'}
        {...props}
      />
      <InputGroupAddon align='inline-end'>
        <InputGroupButton
          className='text-muted-foreground'
          disabled={disabled}
          size='icon-xs'
          type='button'
          variant='ghost'
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <EyeIcon size={18} /> : <EyeOffIcon size={18} />}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  );
};
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
