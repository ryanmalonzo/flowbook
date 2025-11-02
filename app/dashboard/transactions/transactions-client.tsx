"use client";

import { Download, Trash2, Wallet } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table/data-table";
import { DataTableAmountRangeFilter } from "@/components/ui/data-table/data-table-amount-range-filter";
import { DataTableDateRangeFilter } from "@/components/ui/data-table/data-table-date-range-filter";
import { DataTableFacetedFilter } from "@/components/ui/data-table/data-table-faceted-filter";
import { DataTablePagination } from "@/components/ui/data-table/data-table-pagination";
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { Separator } from "@/components/ui/separator";
import { getColumns } from "./columns";
import type {
  PaginationInfo,
  Transaction,
  TransactionFilters,
  TransactionSort,
} from "./types";

interface TransactionsClientProps {
  transactions: Transaction[];
  pagination: PaginationInfo;
  accounts: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
  initialFilters?: TransactionFilters;
  initialSort?: TransactionSort;
}

interface AmountRange {
  min?: number;
  max?: number;
}

export default function TransactionsClient({
  transactions,
  pagination,
  accounts,
  categories,
  initialFilters,
}: TransactionsClientProps) {
  const t = useTranslations("transactions");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchValue, setSearchValue] = React.useState(
    initialFilters?.search || "",
  );
  const [selectedAccounts, setSelectedAccounts] = React.useState<Set<string>>(
    new Set(initialFilters?.accountIds || []),
  );
  const [selectedCategories, setSelectedCategories] = React.useState<
    Set<string>
  >(new Set(initialFilters?.categoryIds || []));
  const [selectedTypes, setSelectedTypes] = React.useState<Set<string>>(
    new Set(initialFilters?.types || []),
  );
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    initialFilters?.dateFrom || initialFilters?.dateTo
      ? {
          from: initialFilters.dateFrom,
          to: initialFilters.dateTo,
        }
      : undefined,
  );
  const [amountRange, setAmountRange] = React.useState<AmountRange | undefined>(
    initialFilters?.amountMin !== undefined ||
      initialFilters?.amountMax !== undefined
      ? {
          min: initialFilters.amountMin,
          max: initialFilters.amountMax,
        }
      : undefined,
  );

  // Count selected rows (this would come from TanStack Table in real implementation)
  const [selectedRowCount, _setSelectedRowCount] = React.useState(0);

  const hasFilters = Boolean(
    searchValue ||
      selectedAccounts.size > 0 ||
      selectedCategories.size > 0 ||
      selectedTypes.size > 0 ||
      dateRange?.from ||
      amountRange,
  );

  // Update URL with current filters
  const updateFilters = React.useCallback(() => {
    const params = new URLSearchParams(searchParams);

    // Reset to page 1 when filters change
    params.set("page", "1");

    // Update filter params
    if (searchValue) {
      params.set("search", searchValue);
    } else {
      params.delete("search");
    }

    if (selectedAccounts.size > 0) {
      params.set("accountIds", Array.from(selectedAccounts).join(","));
    } else {
      params.delete("accountIds");
    }

    if (selectedCategories.size > 0) {
      params.set("categoryIds", Array.from(selectedCategories).join(","));
    } else {
      params.delete("categoryIds");
    }

    if (selectedTypes.size > 0) {
      params.set("types", Array.from(selectedTypes).join(","));
    } else {
      params.delete("types");
    }

    if (dateRange?.from) {
      params.set("dateFrom", dateRange.from.toISOString());
    } else {
      params.delete("dateFrom");
    }

    if (dateRange?.to) {
      params.set("dateTo", dateRange.to.toISOString());
    } else {
      params.delete("dateTo");
    }

    if (amountRange?.min !== undefined) {
      params.set("amountMin", amountRange.min.toString());
    } else {
      params.delete("amountMin");
    }

    if (amountRange?.max !== undefined) {
      params.set("amountMax", amountRange.max.toString());
    } else {
      params.delete("amountMax");
    }

    router.push(`?${params.toString()}`);
  }, [
    searchValue,
    selectedAccounts,
    selectedCategories,
    selectedTypes,
    dateRange,
    amountRange,
    searchParams,
    router,
  ]);

  // Debounce search input
  const SEARCH_DEBOUNCE_MS = 500;
  React.useEffect(() => {
    if (searchValue === initialFilters?.search) {
      return;
    }

    const timer = setTimeout(() => {
      updateFilters();
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timer);
  }, [searchValue, initialFilters?.search, updateFilters]);

  // Update filters immediately for non-search changes
  React.useEffect(() => {
    if (
      selectedAccounts === new Set(initialFilters?.accountIds || []) &&
      selectedCategories === new Set(initialFilters?.categoryIds || []) &&
      selectedTypes === new Set(initialFilters?.types || []) &&
      dateRange === undefined &&
      amountRange === undefined
    ) {
      return;
    }

    updateFilters();
  }, [
    selectedAccounts,
    selectedCategories,
    selectedTypes,
    dateRange,
    amountRange,
    updateFilters,
    initialFilters?.accountIds,
    initialFilters?.categoryIds,
    initialFilters?.types,
  ]);

  const handleReset = () => {
    setSearchValue("");
    setSelectedAccounts(new Set());
    setSelectedCategories(new Set());
    setSelectedTypes(new Set());
    setDateRange(undefined);
    setAmountRange(undefined);

    // Clear URL params
    const params = new URLSearchParams(searchParams);
    params.delete("search");
    params.delete("accountIds");
    params.delete("categoryIds");
    params.delete("types");
    params.delete("dateFrom");
    params.delete("dateTo");
    params.delete("amountMin");
    params.delete("amountMax");
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleBulkDelete = () => {
    // TODO: Implement bulk delete functionality
    console.log("Bulk delete not implemented yet");
  };

  const handleExportCSV = () => {
    // TODO: Implement CSV export functionality
    console.log("CSV export not implemented yet");
  };

  const accountOptions = accounts.map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const typeOptions = [
    { label: t("type.income"), value: "income" },
    { label: t("type.expense"), value: "expense" },
    { label: t("type.transfer"), value: "transfer" },
  ];

  const columns = getColumns(t);

  const toolbar = (
    <div className="flex flex-col gap-4">
      <DataTableToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        showReset={hasFilters}
        onReset={handleReset}
      >
        <DataTableDateRangeFilter
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
        <DataTableFacetedFilter
          title="Account"
          options={accountOptions}
          selectedValues={selectedAccounts}
          onSelectedChange={setSelectedAccounts}
        />
        <DataTableFacetedFilter
          title="Category"
          options={categoryOptions}
          selectedValues={selectedCategories}
          onSelectedChange={setSelectedCategories}
        />
        <DataTableFacetedFilter
          title="Type"
          options={typeOptions}
          selectedValues={selectedTypes}
          onSelectedChange={setSelectedTypes}
        />
        <DataTableAmountRangeFilter
          amountRange={amountRange}
          onAmountRangeChange={setAmountRange}
        />
      </DataTableToolbar>

      {selectedRowCount > 0 && (
        <div className="flex items-center justify-between rounded-lg border bg-muted/50 px-4 py-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{selectedRowCount} selected</Badge>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-muted-foreground text-sm">
              {t("bulkActions.label")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="h-8"
            >
              <Download className="mr-2 h-4 w-4" />
              {t("bulkActions.exportCsv")}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              className="h-8"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("bulkActions.deleteSelected")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  const paginationComponent = (
    <DataTablePagination
      currentPage={pagination.page}
      pageSize={pagination.pageSize}
      total={pagination.total}
      totalPages={pagination.totalPages}
    />
  );

  if (transactions.length === 0 && !hasFilters) {
    return (
      <Card className="border-dashed">
        <CardHeader className="pt-12 pb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Wallet className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">{t("empty.title")}</CardTitle>
          <CardDescription className="text-base">
            {t("empty.description")}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={transactions}
      toolbar={toolbar}
      pagination={paginationComponent}
    />
  );
}
