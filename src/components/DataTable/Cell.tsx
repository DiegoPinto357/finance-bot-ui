import { flexRender } from '@tanstack/react-table';
import { useDrop } from 'react-dnd';
import { TableCell } from '@/components/ui/table';
import { getCommonPinningStyles } from './utils';

import type { Cell } from '@tanstack/react-table';
import type { Asset, AssetClass } from '@/types';

type CellPosition = {
  rowId: string;
  colId: Asset;
};

export type DragAndDropInfo = {
  drag: CellPosition;
  drop: CellPosition;
};

type Props<TData, TValue> = {
  cell: Cell<TData, TValue>;
  className?: string;
  onDrop?: (dragAndDropInfo: DragAndDropInfo) => void;
};

const Cell = <TData, TValue>({
  cell,
  className,
  onDrop,
}: Props<TData, TValue>) => {
  const [, drop] = useDrop(
    () => ({
      accept: 'tableCell',
      drop: (dragCell: CellPosition) => {
        if (onDrop) {
          const rowId = cell.row.getAllCells()[0].getValue<string>();
          const asset = cell.column.id.split(':');
          const colId = { class: asset[0] as AssetClass, name: asset[1] };
          onDrop({ drag: dragCell, drop: { rowId, colId } });
        }
      },
    }),
    []
  );

  return (
    <TableCell
      key={cell.id}
      ref={drop}
      className={className}
      style={getCommonPinningStyles(cell.column)}
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
};

export default Cell;
