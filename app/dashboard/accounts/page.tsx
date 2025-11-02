import { getRequiredUser } from "@/lib/auth/utils";
import AccountsClient from "./accounts-client";
import { getUserAccounts } from "./queries";

export default async function AccountsPage() {
  const user = await getRequiredUser();

  const accounts = await getUserAccounts(user.id);

  return <AccountsClient accounts={accounts} />;
}
