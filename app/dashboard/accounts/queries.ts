import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { financialAccounts } from "@/db/schema/budget";

export async function getUserAccounts(userId: string) {
  const accounts = await db
    .select({
      id: financialAccounts.id,
      name: financialAccounts.name,
      type: financialAccounts.type,
      balance: financialAccounts.balance,
      currency: financialAccounts.currency,
    })
    .from(financialAccounts)
    .where(
      and(
        eq(financialAccounts.userId, userId),
        isNull(financialAccounts.deletedAt),
      ),
    );

  return accounts;
}
