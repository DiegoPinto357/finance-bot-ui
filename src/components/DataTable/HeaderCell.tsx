import { TableHead } from '@/components/ui/table';
import { flexRender } from '@tanstack/react-table';
import { getCommonPinningStyles } from './utils';

import type { Table, Header, Column } from '@tanstack/react-table';

// https://github.com/TanStack/table/discussions/3947#discussioncomment-9564867
const columnSizingHandler = <TData,>(
  thElem: HTMLTableCellElement | null,
  table: Table<TData>,
  column: Column<TData>
) => {
  if (!thElem) return;
  if (
    table.getState().columnSizing[column.id] ===
    thElem.getBoundingClientRect().width
  )
    return;

  table.setColumnSizing(prevSizes => ({
    ...prevSizes,
    [column.id]: thElem.getBoundingClientRect().width,
  }));
};

type Props<TData, TValue> = {
  table: Table<TData>;
  header: Header<TData, TValue>;
};

const HeaderCell = <TData, TValue>({ table, header }: Props<TData, TValue>) => {
  return (
    <TableHead
      style={{ ...getCommonPinningStyles(header.column) }}
      ref={thElem => columnSizingHandler<TData>(thElem, table, header.column)}
    >
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
    </TableHead>
  );
};

export default HeaderCell;
