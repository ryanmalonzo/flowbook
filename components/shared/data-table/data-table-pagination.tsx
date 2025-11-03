"use client";

import type { Table } from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

const PAGE_SIZE_10 = 10;
const PAGE_SIZE_20 = 20;
const PAGE_SIZE_30 = 30;
const PAGE_SIZE_50 = 50;
const PAGE_SIZE_100 = 100;

const PAGE_SIZE_OPTIONS = [
  PAGE_SIZE_10,
  PAGE_SIZE_20,
  PAGE_SIZE_30,
  PAGE_SIZE_50,
  PAGE_SIZE_100,
] as const;

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const t = useTranslations("transactions");

  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageSize = table.getState().pagination.pageSize;
  const totalRows = table.getFilteredRowModel().rows.length;
  const totalPages = table.getPageCount();

  const startIndex = table.getState().pagination.pageIndex * pageSize + 1;
  const endIndex = Math.min(
    (table.getState().pagination.pageIndex + 1) * pageSize,
    totalRows,
  );

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-muted-foreground text-sm">
        {totalRows === 0
          ? t("pagination.noResults")
          : t("pagination.showing", {
              start: startIndex,
              end: endIndex,
              total: totalRows,
            })}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="font-medium text-sm">{t("pagination.rowsPerPage")}</p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent side="top">
              {PAGE_SIZE_OPTIONS.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center font-medium text-sm">
          {t("pagination.page", {
            current: currentPage,
            total: totalPages || 1,
          })}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t("pagination.goToFirstPage")}</span>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">{t("pagination.goToPreviousPage")}</span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t("pagination.goToNextPage")}</span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">{t("pagination.goToLastPage")}</span>
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
