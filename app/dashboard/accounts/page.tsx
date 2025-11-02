import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import AccountsClient from "./accounts-client";
import { getUserAccounts } from "./queries";

export default async function AccountsPage() {
  // Fetch session server-side (auth check is in layout)
  const sessionResponse = await auth.api.getSession({
    headers: await headers(),
  });

  const user = sessionResponse?.user;

  // Fetch user's accounts
  const accounts = user ? await getUserAccounts(user.id) : [];

  return <AccountsClient accounts={accounts} />;
}
