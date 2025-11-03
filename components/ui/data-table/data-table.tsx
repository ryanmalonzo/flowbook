"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";

interface AmountRange {
  min?: number;
  max?: number;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchValue?: string;
  selectedAccounts?: Set<string>;
  selectedCategories?: Set<string>;
  selectedTypes?: Set<string>;
  dateRange?: DateRange;
  amountRange?: AmountRange;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchValue,
  selectedAccounts,
  selectedCategories,
  selectedTypes,
  dateRange,
  amountRange,
}: DataTableProps<TData, TValue>) {
  const t = useTranslations("transactions");
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Client-side filtering
  const filteredData = React.useMemo(() => {
    return data.filter((row: any) => {
      // Search filter
      if (searchValue && !row.description?.toLowerCase().includes(searchValue.toLowerCase())) {
        return false;
      }

      // Account filter
      if (selectedAccounts && selectedAccounts.size > 0 && !selectedAccounts.has(row.accountId)) {
        return false;
      }

      // Category filter
      if (selectedCategories && selectedCategories.size > 0) {
        const categoryId = row.categoryId || "uncategorized";
        if (!selectedCategories.has(categoryId)) {
          return false;
        }
      }

      // Type filter
      if (selectedTypes && selectedTypes.size > 0 && !selectedTypes.has(row.type)) {
        return false;
      }

      // Date range filter
      if (dateRange?.from || dateRange?.to) {
        const rowDate = new Date(row.date);
        if (dateRange.from && rowDate < dateRange.from) {
          return false;
        }
        if (dateRange.to && rowDate > dateRange.to) {
          return false;
        }
      }

      // Amount range filter
      if (amountRange) {
        const amount = Number.parseFloat(row.amount);
        if (amountRange.min !== undefined && amount < amountRange.min) {
          return false;
        }
        if (amountRange.max !== undefined && amount > amountRange.max) {
          return false;
        }
      }

      return true;
    });
  }, [data, searchValue, selectedAccounts, selectedCategories, selectedTypes, dateRange, amountRange]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
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
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {t("table.noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

