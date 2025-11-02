import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import DashboardLayout from "./dashboard-layout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch session server-side
  const sessionResponse = await auth.api.getSession({
    headers: await headers(),
  });

  const user = sessionResponse?.user;

  // Redirect to sign-in if not authenticated
  if (!user) {
    redirect("/sign-in");
  }

  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
