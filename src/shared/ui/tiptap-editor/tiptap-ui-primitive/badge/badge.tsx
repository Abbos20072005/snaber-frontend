import '@/shared/ui/tiptap-editor/tiptap-ui-primitive/badge/badge-colors.scss';
import '@/shared/ui/tiptap-editor/tiptap-ui-primitive/badge/badge-group.scss';
import '@/shared/ui/tiptap-editor/tiptap-ui-primitive/badge/badge.scss';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  appearance?: 'default' | 'emphasized' | 'subdued';
  size?: 'default' | 'small';
  trimText?: boolean;
  variant?: 'default' | 'ghost' | 'gray' | 'green' | 'white' | 'yellow';
}

export const Badge = ({
  ref,
  variant,
  size = 'default',
  appearance = 'default',
  trimText = false,
  className,
  children,
  ...props
}: BadgeProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  return (
    <div
      ref={ref}
      className={`tiptap-badge ${className || ''}`}
      data-appearance={appearance}
      data-size={size}
      data-style={variant}
      data-text-trim={trimText ? 'on' : 'off'}
      {...props}
    >
      {children}
    </div>
  );
};

Badge.displayName = 'Badge';

export default Badge;
