import { getRequiredUser } from "@/lib/auth/utils";
import { getUserAccounts } from "../accounts/queries";
import { getUserCategories } from "../categories/queries";
import { getTransactions } from "./queries";
import TransactionsClient from "./transactions-client";
import type { TransactionFilters, TransactionSort } from "./types";

interface TransactionsPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    accountIds?: string;
    categoryIds?: string;
    types?: string;
    dateFrom?: string;
    dateTo?: string;
    amountMin?: string;
    amountMax?: string;
    sortField?: string;
    sortDirection?: string;
  }>;
}

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const user = await getRequiredUser();
  const params = await searchParams;

  // Parse pagination parameters
  const page = Number.parseInt(params.page || "1", 10);
  const pageSize = Number.parseInt(params.pageSize || "10", 10);

  // Parse filter parameters
  const filters: TransactionFilters = {
    search: params.search || undefined,
    accountIds: params.accountIds ? params.accountIds.split(",") : undefined,
    categoryIds: params.categoryIds ? params.categoryIds.split(",") : undefined,
    types: params.types
      ? (params.types.split(",") as Array<"income" | "expense" | "transfer">)
      : undefined,
    dateFrom: params.dateFrom ? new Date(params.dateFrom) : undefined,
    dateTo: params.dateTo ? new Date(params.dateTo) : undefined,
    amountMin: params.amountMin
      ? Number.parseFloat(params.amountMin)
      : undefined,
    amountMax: params.amountMax
      ? Number.parseFloat(params.amountMax)
      : undefined,
  };

  // Parse sort parameters
  const sort: TransactionSort | undefined =
    params.sortField && params.sortDirection
      ? {
          field: params.sortField as TransactionSort["field"],
          direction: params.sortDirection as TransactionSort["direction"],
        }
      : undefined;

  // Fetch data in parallel
  const [transactionsResult, accounts, categories] = await Promise.all([
    getTransactions(user.id, { page, pageSize }, filters, sort),
    getUserAccounts(user.id),
    getUserCategories(user.id),
  ]);

  return (
    <TransactionsClient
      transactions={transactionsResult.transactions}
      pagination={transactionsResult.pagination}
      accounts={accounts.map((a) => ({ id: a.id, name: a.name }))}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      initialFilters={filters}
      initialSort={sort}
    />
  );
}
