import type { VariantProps } from 'class-variance-authority';

import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { ToggleGroup as ToggleGroupPrimitive } from '@base-ui/react/toggle-group';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';
import { toggleVariants } from '@/shared/ui/toggle';

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number;
    orientation?: 'horizontal' | 'vertical';
  }
>({
  size: 'default',
  variant: 'default',
  spacing: 0,
  orientation: 'horizontal'
});

const ToggleGroup = ({
  className,
  variant,
  size,
  spacing = 0,
  orientation = 'horizontal',
  children,
  ...props
}: ToggleGroupPrimitive.Props &
  VariantProps<typeof toggleVariants> & {
    spacing?: number;
    orientation?: 'horizontal' | 'vertical';
  }) => {
  return (
    <ToggleGroupPrimitive
      className={cn(
        'group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-md data-vertical:flex-col data-vertical:items-stretch data-[spacing=0]:data-[variant=outline]:shadow-xs',
        className
      )}
      data-size={size}
      data-spacing={spacing}
      data-variant={variant}
      style={{ '--gap': spacing } as React.CSSProperties}
      data-orientation={orientation}
      data-slot='toggle-group'
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size, spacing, orientation }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive>
  );
};

const ToggleGroupItem = ({
  className,
  children,
  variant = 'default',
  size = 'default',
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) => {
  const context = React.use(ToggleGroupContext);

  return (
    <TogglePrimitive
      className={cn(
        'data-[state=on]:bg-muted shrink-0 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 group-data-[spacing=0]/toggle-group:shadow-none focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-1.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-1.5 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-md group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-md group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-md group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-md group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t',
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size
        }),
        className
      )}
      data-size={context.size || size}
      data-spacing={context.spacing}
      data-variant={context.variant || variant}
      data-slot='toggle-group-item'
      {...props}
    >
      {children}
    </TogglePrimitive>
  );
};

export { ToggleGroup, ToggleGroupItem };
