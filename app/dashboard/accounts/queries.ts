import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { financialAccounts } from "@/db/schema/budget";
import logger from "@/lib/logger";

export async function getUserAccounts(userId: string) {
  logger.debug({ userId }, "Fetching user accounts");

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

  logger.info({ userId, count: accounts.length }, "Retrieved user accounts");
  return accounts;
}
