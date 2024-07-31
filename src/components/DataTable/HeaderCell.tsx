import { TableHead } from '@/components/ui/table';
import { flexRender } from '@tanstack/react-table';
import { getCommonPinningStyles } from './utils';

import type { Header } from '@tanstack/react-table';

type Props<TData, TValue> = {
  header: Header<TData, TValue>;
};

const HeaderCell = <TData, TValue>({ header }: Props<TData, TValue>) => {
  return (
    <TableHead style={{ ...getCommonPinningStyles(header.column) }}>
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
    </TableHead>
  );
};

export default HeaderCell;
