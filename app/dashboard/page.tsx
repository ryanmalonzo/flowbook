import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  // Fetch session server-side
  const sessionResponse = await auth.api.getSession({
    headers: await headers(),
  });

  const user = sessionResponse?.user || null;

  return <DashboardClient user={user} />;
}
