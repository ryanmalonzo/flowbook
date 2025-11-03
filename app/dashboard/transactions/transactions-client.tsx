"use client";

import { Download, Trash2, Wallet } from "lucide-react";
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
import { DataTableToolbar } from "@/components/ui/data-table/data-table-toolbar";
import { Separator } from "@/components/ui/separator";
import { getColumns } from "./columns";
import type { Transaction } from "./types";

interface TransactionsClientProps {
  transactions: Transaction[];
  accounts: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
  currency: string;
}

interface AmountRange {
  min?: number;
  max?: number;
}

export default function TransactionsClient({
  transactions,
  accounts,
  categories,
  currency,
}: TransactionsClientProps) {
  const t = useTranslations("transactions");

  // Pure React state - no URL navigation
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedAccounts, setSelectedAccounts] = React.useState<Set<string>>(
    new Set(),
  );
  const [selectedCategories, setSelectedCategories] = React.useState<
    Set<string>
  >(new Set());
  const [selectedTypes, setSelectedTypes] = React.useState<Set<string>>(
    new Set(),
  );
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [amountRange, setAmountRange] = React.useState<
    AmountRange | undefined
  >();

  const hasFilters = Boolean(
    searchValue ||
      selectedAccounts.size > 0 ||
      selectedCategories.size > 0 ||
      selectedTypes.size > 0 ||
      dateRange?.from ||
      amountRange,
  );

  const handleReset = () => {
    setSearchValue("");
    setSelectedAccounts(new Set());
    setSelectedCategories(new Set());
    setSelectedTypes(new Set());
    setDateRange(undefined);
    setAmountRange(undefined);
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

  const columns = getColumns(t, currency);

  const toolbar = (
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
  );

  return (
    <div className="space-y-4">
      {toolbar}
      {transactions.length === 0 ? (
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
      ) : (
        <DataTable
          columns={columns}
          data={transactions}
          searchValue={searchValue}
          selectedAccounts={selectedAccounts}
          selectedCategories={selectedCategories}
          selectedTypes={selectedTypes}
          dateRange={dateRange}
          amountRange={amountRange}
        />
      )}
    </div>
  );
}
