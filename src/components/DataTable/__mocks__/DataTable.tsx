import { act } from 'react-dom/test-utils';
import ActualDataTable from '../DataTable';

import type { DataTableProps } from '../DataTable';
import type { DragAndDropInfo } from '../Cell';

let onCellDrop: DataTableProps<unknown, unknown>['onCellDrop'];

// eslint-disable-next-line react-refresh/only-export-components
export const triggerCellDrop = (dragAndDropInfo: DragAndDropInfo) => {
  act(() => {
    if (onCellDrop) {
      onCellDrop(dragAndDropInfo);
    }
  });
};

const DataTable = <TData, TValue>(props: DataTableProps<TData, TValue>) => {
  onCellDrop = props.onCellDrop;
  return <ActualDataTable {...props} />;
};

export default DataTable;
