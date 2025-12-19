"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { memo, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchable?: boolean;
  searchKey?: string;
  searchPlaceholder?: string;
  pagination?: boolean;
  pageSize?: number;
  columnVisibility?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  className?: string;
  containerClassName?: string;
  emptyState?: React.ReactNode;
  searchValue?: string;
  title?: string;
  showCount?: boolean;
  filterOptions?: Array<{
    label: string;
    value: string;
    options: Array<{ label: string; value: string }>;
    onChange: (value: string) => void;
  }>;
  customActions?: React.ReactNode;
  customSearch?: React.ReactNode; // NEW: Custom search component
}

function DataTableComponent<TData, TValue>({
  columns,
  data,
  searchable = false,
  searchKey,
  searchPlaceholder = "Search...",
  pagination = false,
  pageSize = 10,
  columnVisibility = false,
  sortable = false,
  filterable = false,
  className = "",
  containerClassName = "",
  emptyState,
  searchValue,
  title,
  showCount = false,
  filterOptions = [],
  customActions,
  customSearch, // NEW
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibilityState, setColumnVisibilityState] =
    useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(pagination && {
      getPaginationRowModel: getPaginationRowModel(),
      initialState: {
        pagination: {
          pageSize,
        },
      },
    }),
    ...(sortable && {
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
    }),
    ...(filterable && {
      onColumnFiltersChange: setColumnFilters,
      getFilteredRowModel: getFilteredRowModel(),
    }),
    ...(columnVisibility && {
      onColumnVisibilityChange: setColumnVisibilityState,
    }),
    onRowSelectionChange: setRowSelection,
    state: {
      ...(sortable && { sorting }),
      ...(filterable && { columnFilters }),
      ...(columnVisibility && { columnVisibility: columnVisibilityState }),
      rowSelection,
    },
  });

  useEffect(() => {
    if (searchKey && searchValue !== undefined) {
      table.getColumn(searchKey)?.setFilterValue(searchValue);
    }
  }, [searchValue, searchKey, table]);

  return (
    <div
      className={`bg-white rounded-sm border border-slate-200 ${containerClassName}`}
    >
      {(title || searchable || customSearch || filterOptions.length > 0 || customActions) && (
        <div className="flex items-center justify-between gap-4 flex-wrap px-4 py-4 border-b border-slate-100">
          {/* Title and Count */}
          {title && (
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">
                {title}
              </h2>
              {showCount && (
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm">
                  {table.getFilteredRowModel().rows.length}
                </span>
              )}
            </div>
          )}

          {/* Search and Filters */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            {/* Custom Search Component (if provided) */}
            {customSearch && customSearch}

            {/* Default Search (only if no custom search and searchable is true) */}
            {!customSearch && searchable && searchKey && (
              <div className="relative w-full max-w-sm">
                <Input
                  placeholder={searchPlaceholder}
                  value={
                    (table.getColumn(searchKey)?.getFilterValue() as string) ??
                    ""
                  }
                  onChange={(event) =>
                    table
                      .getColumn(searchKey)
                      ?.setFilterValue(event.target.value)
                  }
                  className="w-full h-8 text-sm bg-white border-slate-200 rounded-sm focus:border-slate-900"
                />
              </div>
            )}

            {/* Filter Dropdowns */}
            {filterOptions.map((filter, index) => (
              <Select key={index} value={filter.value} onValueChange={filter.onChange}>
                <SelectTrigger className="w-[140px] h-8 text-xs font-medium uppercase tracking-wider border-slate-200 rounded-sm bg-white">
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent className="border-slate-200">
                  {filter.options.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-sm"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}

            {/* Custom Actions */}
            {customActions}

            {/* Column Visibility */}
            {columnVisibility && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-slate-200 rounded-sm text-xs font-medium uppercase tracking-wider"
                  >
                    Columns
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-slate-200">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize text-sm"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      )}

      <div className={`overflow-auto w-full ${className}`}>
        <Table className="w-full cursor-pointer">
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="hover:bg-transparent border-slate-200"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="h-10 px-4 text-xs font-bold uppercase tracking-widest text-slate-500"
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-slate-100 hover:bg-slate-50/50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-3 text-sm text-slate-600"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-slate-500"
                >
                  {emptyState || "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between py-4 px-4 border-t border-slate-100 bg-slate-50/30">
          <div className="flex-1 text-xs text-slate-500">
            {table.getFilteredSelectedRowModel().rows.length > 0 && (
              <span>
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </span>
            )}
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Rows per page
              </p>
              <Select
                value={table.getState().pagination.pageSize.toString()}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px] border-slate-200 rounded-sm bg-white text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-slate-200">
                  {[10, 20, 30, 40, 50].map((size) => (
                    <SelectItem
                      className="text-xs"
                      key={size}
                      value={size.toString()}
                    >
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-[100px] items-center justify-center text-xs font-medium text-slate-500 uppercase tracking-wide">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-8 w-8 p-0 rounded-sm border-slate-200"
              >
                <span className="sr-only">Previous</span>
                &lt;
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-8 w-8 p-0 rounded-sm border-slate-200"
              >
                <span className="sr-only">Next</span>
                &gt;
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Export memoized version
export const DataTable = memo(DataTableComponent) as typeof DataTableComponent;