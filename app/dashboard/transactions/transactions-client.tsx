"use client";

import { Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { DataTable } from "@/components/shared/data-table/data-table";
import { DataTableAmountRangeFilter } from "@/components/shared/data-table/data-table-amount-range-filter";
import { DataTableDateRangeFilter } from "@/components/shared/data-table/data-table-date-range-filter";
import { DataTableFacetedFilter } from "@/components/shared/data-table/data-table-faceted-filter";
import { DataTableToolbar } from "@/components/shared/data-table/data-table-toolbar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const [selectedVendors, setSelectedVendors] = React.useState<Set<string>>(
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
      selectedVendors.size > 0 ||
      dateRange?.from ||
      amountRange,
  );

  const handleReset = () => {
    setSearchValue("");
    setSelectedAccounts(new Set());
    setSelectedCategories(new Set());
    setSelectedTypes(new Set());
    setSelectedVendors(new Set());
    setDateRange(undefined);
    setAmountRange(undefined);
  };

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((transaction) => {
      if (
        searchValue &&
        !transaction.description
          ?.toLowerCase()
          .includes(searchValue.toLowerCase())
      ) {
        return false;
      }

      if (
        selectedAccounts.size > 0 &&
        !selectedAccounts.has(transaction.accountId)
      ) {
        return false;
      }

      if (selectedCategories.size > 0) {
        const categoryId = transaction.categoryId || "uncategorized";
        if (!selectedCategories.has(categoryId)) {
          return false;
        }
      }

      if (selectedTypes.size > 0 && !selectedTypes.has(transaction.type)) {
        return false;
      }

      if (selectedVendors.size > 0) {
        const vendor = transaction.vendor || "no-vendor";
        if (!selectedVendors.has(vendor)) {
          return false;
        }
      }

      if (dateRange?.from || dateRange?.to) {
        const transactionDate = new Date(transaction.date);
        if (dateRange.from && transactionDate < dateRange.from) {
          return false;
        }
        if (dateRange.to && transactionDate > dateRange.to) {
          return false;
        }
      }

      if (amountRange) {
        const amount = Number.parseFloat(transaction.amount);
        if (amountRange.min !== undefined && amount < amountRange.min) {
          return false;
        }
        if (amountRange.max !== undefined && amount > amountRange.max) {
          return false;
        }
      }

      return true;
    });
  }, [
    transactions,
    searchValue,
    selectedAccounts,
    selectedCategories,
    selectedTypes,
    selectedVendors,
    dateRange,
    amountRange,
  ]);

  const _handleBulkDelete = () => {
    // TODO: Implement bulk delete functionality
    console.log("Bulk delete not implemented yet");
  };

  const _handleExportCSV = () => {
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

  const vendorOptions = React.useMemo(() => {
    const uniqueVendors = new Set<string>();
    for (const transaction of transactions) {
      if (transaction.vendor) {
        uniqueVendors.add(transaction.vendor);
      }
    }
    const options = Array.from(uniqueVendors)
      .sort()
      .map((vendor) => ({
        label: vendor,
        value: vendor,
      }));

    const hasNoVendor = transactions.some((transaction) => !transaction.vendor);
    if (hasNoVendor) {
      options.push({ label: "No vendor", value: "no-vendor" });
    }

    return options;
  }, [transactions]);

  const columns = getColumns(t, currency);

  const toolbar = (
    <DataTableToolbar
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      showReset={hasFilters}
      onReset={handleReset}
      translationNamespace="transactions"
    >
      <DataTableDateRangeFilter
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
      <DataTableFacetedFilter
        title="Type"
        options={typeOptions}
        selectedValues={selectedTypes}
        onSelectedChange={setSelectedTypes}
      />
      <DataTableFacetedFilter
        title="Category"
        options={categoryOptions}
        selectedValues={selectedCategories}
        onSelectedChange={setSelectedCategories}
      />
      <DataTableFacetedFilter
        title="Vendor"
        options={vendorOptions}
        selectedValues={selectedVendors}
        onSelectedChange={setSelectedVendors}
      />
      <DataTableFacetedFilter
        title="Account"
        options={accountOptions}
        selectedValues={selectedAccounts}
        onSelectedChange={setSelectedAccounts}
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
          data={filteredTransactions}
          translationNamespace="transactions"
        />
      )}
    </div>
  );
}
