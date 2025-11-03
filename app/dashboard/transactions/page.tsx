import { getRequiredUser } from "@/lib/auth/utils";
import { getUserAccounts } from "../accounts/queries";
import { getUserCategories } from "../categories/queries";
import { getAllTransactions } from "./queries";
import TransactionsClient from "./transactions-client";

export default async function TransactionsPage() {
  const user = await getRequiredUser();

  // Fetch all data in parallel
  const [transactions, accounts, categories] = await Promise.all([
    getAllTransactions(user.id),
    getUserAccounts(user.id),
    getUserCategories(user.id),
  ]);

  return (
    <TransactionsClient
      transactions={transactions}
      accounts={accounts.map((a) => ({ id: a.id, name: a.name }))}
      categories={categories.map((c) => ({ id: c.id, name: c.name }))}
    />
  );
}
