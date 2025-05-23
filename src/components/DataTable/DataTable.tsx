import { useState, useRef, useEffect } from 'react';
import { useDndScrolling } from 'react-dnd-scrolling';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import HeaderCell from './HeaderCell';
import Cell from './Cell';

import type {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
  SortingState,
} from '@tanstack/react-table';
import type { DragAndDropInfo } from './Cell';

type CellStyle = {
  classname: string;
  excludeFirstCol?: boolean;
};

export type DataTableProps<TData, TValue> = {
  className?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | undefined;
  columnPinning?: { left: string[]; right: string[] };
  columnSelector?: boolean;
  scrollToBottom?: boolean;
  scrollToBottomTrigger?: boolean;
  cellStyle?: CellStyle;
  onCellDrop?: (dragAndDropInfo: DragAndDropInfo) => void;
};

const DataTable = <TData, TValue>({
  className,
  columns,
  data,
  columnPinning,
  columnSelector,
  scrollToBottom,
  scrollToBottomTrigger,
  cellStyle,
  onCellDrop,
}: DataTableProps<TData, TValue>) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: data || [],
    columns,
    enableColumnPinning: true,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    initialState: {
      columnPinning: columnPinning || { left: [], right: [] },
    },
    state: {
      columnFilters,
      columnVisibility,
      sorting,
    },
  });

  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const lastRowRef = useRef<HTMLTableRowElement | null>(null);

  useDndScrolling(tableContainerRef, {
    strengthMultiplier: 50,
  });

  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;

    const onWheel = (event: WheelEvent) => {
      if (event.shiftKey) {
        event.preventDefault();
        container.scrollLeft += event.deltaY;
      }
    };

    container.addEventListener('wheel', onWheel);

    return () => {
      container.removeEventListener('wheel', onWheel);
    };
  }, []);

  useEffect(() => {
    if (scrollToBottom && lastRowRef.current) {
      lastRowRef.current.scrollIntoView();
    }
  }, [scrollToBottom, scrollToBottomTrigger]);

  return (
    <div className={className}>
      <div className="flex items-center">
        {/* TODO makes filter filter optional and configurable */}
        {/* <Input
          placeholder="Filter assets..."
          value={(table.getColumn('asset')?.getFilterValue() as string) ?? ''}
          onChange={event =>
            table.getColumn('asset')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        /> */}
        {columnSelector ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter(column => column.getCanHide())
                .map(column => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={value =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </div>

      <div
        ref={tableContainerRef}
        className="rounded-md border max-h-[73vh] overflow-y-auto"
      >
        <Table>
          <TableHeader className="sticky top-0 z-10 opacity-95 bg-background">
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <HeaderCell key={header.id} table={table} header={header} />
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index, rows) => {
                const isLastRow = index === rows.length - 1;
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    ref={isLastRow ? lastRowRef : undefined}
                  >
                    {row.getVisibleCells().map((cell, index) => {
                      const isFirstCol = index === 0;
                      const cellStyleClass =
                        cellStyle?.excludeFirstCol && isFirstCol
                          ? ''
                          : cellStyle?.classname ?? '';
                      return (
                        <Cell
                          key={cell.id}
                          cell={cell}
                          className={cellStyleClass}
                          onDrop={onCellDrop}
                        />
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                {/* TODO add loader (prop isLoading) */}
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
