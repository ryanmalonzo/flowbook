"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export function DataTablePagination({
  currentPage,
  pageSize,
  total,
  totalPages,
}: DataTablePaginationProps) {
  const t = useTranslations("transactions");
  const router = useRouter();
  const searchParams = useSearchParams();

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  const updatePageSize = (newPageSize: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("pageSize", newPageSize);
    params.set("page", "1"); // Reset to first page
    router.push(`?${params.toString()}`);
  };

  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, total);

  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-muted-foreground text-sm">
        {total === 0
          ? t("pagination.noResults")
          : t("pagination.showing", {
              start: startIndex,
              end: endIndex,
              total,
            })}
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">
            {t("pagination.rowsPerPage")}
          </p>
          <Select value={pageSize.toString()} onValueChange={updatePageSize}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          {t("pagination.page", {
            current: currentPage,
            total: totalPages || 1,
          })}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => updatePage(1)}
            disabled={currentPage <= 1}
          >
            <span className="sr-only">
              {t("pagination.goToFirstPage")}
            </span>
            <ChevronsLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => updatePage(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <span className="sr-only">
              {t("pagination.goToPreviousPage")}
            </span>
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => updatePage(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <span className="sr-only">
              {t("pagination.goToNextPage")}
            </span>
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => updatePage(totalPages)}
            disabled={currentPage >= totalPages}
          >
            <span className="sr-only">
              {t("pagination.goToLastPage")}
            </span>
            <ChevronsRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

