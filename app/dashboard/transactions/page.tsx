import { getRequiredUser } from "@/lib/auth/utils";
import { getUserAccounts } from "../accounts/queries";
import { getUserCategories } from "../categories/queries";
import { getTransactions } from "./queries";
import TransactionsClient from "./transactions-client";

interface TransactionsPageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
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

  // Fetch data in parallel
  const [transactionsResult, accounts, categories] = await Promise.all([
    getTransactions(user.id, { page, pageSize }),
    getUserAccounts(user.id),
    getUserCategories(user.id),
  ]);

  return (
    <TransactionsClient
      transactions={transactionsResult.transactions}
      pagination={transactionsResult.pagination}
      accounts={accounts.map((a) => ({ id: a.id, name: a.name }))}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
}
