import type { Column } from '@tanstack/react-table';

export function getCommonPinningStyles<TData>({
  column,
  withBorder = false,
  isSelected = false
}: {
  column: Column<TData>;
  withBorder?: boolean;
  isSelected?: boolean;
}): React.CSSProperties {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn = isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn = isPinned === 'right' && column.getIsFirstColumn('right');

  return {
    boxShadow: withBorder
      ? isLastLeftPinnedColumn
        ? '-4px 0 4px -4px var(--border) inset'
        : isFirstRightPinnedColumn
          ? '4px 0 4px -4px var(--border) inset'
          : undefined
      : undefined,
    border: withBorder ? `1px solid var(--border)` : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 0.97 : 1,
    position: isPinned ? 'sticky' : 'relative',
    background: isPinned ? (isSelected ? 'var(--muted)' : 'var(--background)') : 'transparent',
    width: column.getSize(),
    zIndex: isPinned ? 1 : 0
  };
}
