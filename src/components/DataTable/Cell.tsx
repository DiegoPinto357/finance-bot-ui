import { flexRender } from '@tanstack/react-table';
import { useDrop } from 'react-dnd';
import { TableCell } from '@/components/ui/table';

import type { Cell } from '@tanstack/react-table';

type CellPosition = {
  rowId: string;
  colId: string;
};

export type DragAndDropInfo = {
  drag: CellPosition;
  drop: CellPosition;
};

type Props<TData, TValue> = {
  cell: Cell<TData, TValue>;
  onDrop?: (dragAndDropInfo: DragAndDropInfo) => void;
};

const Cell = <TData, TValue>({ cell, onDrop }: Props<TData, TValue>) => {
  const [, drop] = useDrop(
    () => ({
      accept: 'tableCell',
      drop: (dragCell: CellPosition) => {
        if (onDrop) {
          const rowId = cell.row.getAllCells()[0].getValue<string>();
          const colId = cell.column.id;
          onDrop({ drag: dragCell, drop: { rowId, colId } });
        }
      },
    }),
    []
  );

  return (
    <TableCell key={cell.id} ref={drop}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
};

export default Cell;
