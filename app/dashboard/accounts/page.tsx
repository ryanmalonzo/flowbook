import { getRequiredUser } from "@/lib/auth/utils";
import { getUserSettings } from "@/lib/queries/settings";
import AccountsClient from "./accounts-client";
import { getUserAccounts } from "./queries";

export default async function AccountsPage() {
  const user = await getRequiredUser();

  const [accounts, settings] = await Promise.all([
    getUserAccounts(user.id),
    getUserSettings(user.id),
  ]);

  return (
    <AccountsClient accounts={accounts} defaultCurrency={settings.currency} />
  );
}
