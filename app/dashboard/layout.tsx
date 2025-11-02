import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/utils";
import DashboardLayout from "./dashboard-layout";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
