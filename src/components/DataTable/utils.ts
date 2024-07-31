import type { CSSProperties } from 'react';
import type { Column } from '@tanstack/react-table';

export const getCommonPinningStyles = <TData, TValue>(
  column: Column<TData, TValue>
): CSSProperties => {
  const isPinned = column.getIsPinned();
  const isLastLeftPinnedColumn =
    isPinned === 'left' && column.getIsLastColumn('left');
  const isFirstRightPinnedColumn =
    isPinned === 'right' && column.getIsFirstColumn('right');

  return {
    boxShadow: isLastLeftPinnedColumn
      ? '-1px 0 hsl(var(--border)) inset'
      : isFirstRightPinnedColumn
      ? '1px 0 hsl(var(--border)) inset'
      : undefined,
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
    right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
    opacity: isPinned ? 0.95 : 1,
    backgroundColor: isPinned ? 'hsl(var(--background))' : 'inherit',
    borderRadius: isLastLeftPinnedColumn
      ? 'calc(var(--radius) - 2px) 0 0 calc(var(--radius) - 2px)'
      : isFirstRightPinnedColumn
      ? '0 calc(var(--radius) - 2px)  calc(var(--radius) - 2px) 0'
      : 'unset',
    position: isPinned ? 'sticky' : 'relative',
    zIndex: isPinned ? 1 : 0,
  };
};
