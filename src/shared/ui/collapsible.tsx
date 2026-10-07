import { Collapsible as CollapsiblePrimitive } from '@base-ui/react/collapsible';

import { cn } from '@/shared/lib/utils.ts';

const Collapsible = ({ ...props }: CollapsiblePrimitive.Root.Props) => {
  return <CollapsiblePrimitive.Root data-slot='collapsible' {...props} />;
};

const CollapsibleTrigger = ({ ...props }: CollapsiblePrimitive.Trigger.Props) => {
  return <CollapsiblePrimitive.Trigger data-slot='collapsible-trigger' {...props} />;
};

const CollapsibleContent = ({ className, ...props }: CollapsiblePrimitive.Panel.Props) => {
  return (
    <CollapsiblePrimitive.Panel
      className={cn(
        "flex h-(--collapsible-panel-height) flex-col justify-end overflow-hidden text-sm transition-all duration-150 ease-out data-ending-style:h-0 data-starting-style:h-0 [&[hidden]:not([hidden='until-found'])]:hidden",
        className
      )}
      data-slot='collapsible-content'
      {...props}
    />
  );
};

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
