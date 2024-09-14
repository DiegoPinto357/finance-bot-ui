import { useState } from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
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

import type { DragAndDropInfo } from './Cell';

export type DataTableProps<TData, TValue> = {
  className?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[] | undefined;
  columnPinning?: { left: string[]; right: string[] };
  columnSelector?: boolean;
  onCellDrop?: (dragAndDropInfo: DragAndDropInfo) => void;
};

const DataTable = <TData, TValue>({
  className,
  columns,
  data,
  columnPinning,
  columnSelector,
  onCellDrop,
}: DataTableProps<TData, TValue>) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: data || [],
    columns,
    enableColumnPinning: true,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    initialState: {
      columnPinning: columnPinning || { left: [], right: [] },
    },
    state: {
      columnFilters,
      columnVisibility,
    },
  });

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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return <HeaderCell key={header.id} header={header} />;
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map(cell => (
                    <Cell key={cell.id} cell={cell} onDrop={onCellDrop} />
                  ))}
                </TableRow>
              ))
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
