import { getRequiredUser } from "@/lib/auth/utils";
import { getUserCurrency } from "@/lib/queries/settings";
import { getUserAccounts } from "../accounts/queries";
import { getUserCategories } from "../categories/queries";
import { getAllTransactions } from "./queries";
import TransactionsClient from "./transactions-client";

export default async function TransactionsPage() {
  const user = await getRequiredUser();

  // Fetch all data in parallel
  const [transactions, accounts, categories, currency] = await Promise.all([
    getAllTransactions(user.id),
    getUserAccounts(user.id),
    getUserCategories(user.id),
    getUserCurrency(user.id),
  ]);

  return (
    <TransactionsClient
      transactions={transactions}
      accounts={accounts}
      categories={categories}
      currency={currency}
    />
  );
}
