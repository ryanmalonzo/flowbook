import { and, eq, gte, inArray, isNull, lte, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { financialAccounts, transactions } from "@/db/schema/budget";
import logger from "@/lib/logger";

/**
 * Calculates the balance for an account by summing all transactions.
 * Only includes 'income' and 'expense' types (transfers are ignored for now).
 * Excludes soft-deleted transactions.
 * Returns 0 if no transactions exist.
 */
async function _calculateAccountBalance(accountId: string): Promise<string> {
  const result = await db
    .select({
      balance: sql<string>`
        COALESCE(
          SUM(
            CASE
              WHEN ${transactions.type} = 'income' THEN ${transactions.amount}
              WHEN ${transactions.type} = 'expense' THEN -${transactions.amount}
              ELSE 0
            END
          ),
          0
        )
      `,
    })
    .from(transactions)
    .where(
      and(
        eq(transactions.accountId, accountId),
        isNull(transactions.deletedAt),
      ),
    );

  return result[0]?.balance ?? "0";
}

/**
 * Calculates balances for multiple accounts in a single query.
 * More efficient than calling calculateAccountBalance multiple times.
 */
async function calculateAccountBalances(
  accountIds: string[],
): Promise<Map<string, string>> {
  if (accountIds.length === 0) {
    return new Map();
  }

  const results = await db
    .select({
      accountId: transactions.accountId,
      balance: sql<string>`
        COALESCE(
          SUM(
            CASE
              WHEN ${transactions.type} = 'income' THEN ${transactions.amount}
              WHEN ${transactions.type} = 'expense' THEN -${transactions.amount}
              ELSE 0
            END
          ),
          0
        )
      `,
    })
    .from(transactions)
    .where(
      and(
        inArray(transactions.accountId, accountIds),
        isNull(transactions.deletedAt),
      ),
    )
    .groupBy(transactions.accountId);

  const balanceMap = new Map<string, string>();
  for (const result of results) {
    balanceMap.set(result.accountId, result.balance);
  }

  // Set 0 for accounts with no transactions
  for (const accountId of accountIds) {
    if (!balanceMap.has(accountId)) {
      balanceMap.set(accountId, "0");
    }
  }

  return balanceMap;
}

export async function getUserAccounts(userId: string) {
  logger.debug({ userId }, "Fetching user accounts");

  const accounts = await db
    .select({
      id: financialAccounts.id,
      name: financialAccounts.name,
      type: financialAccounts.type,
      currency: financialAccounts.currency,
    })
    .from(financialAccounts)
    .where(
      and(
        eq(financialAccounts.userId, userId),
        isNull(financialAccounts.deletedAt),
      ),
    );

  // Calculate balances for all accounts in a single query
  const accountIds = accounts.map((account) => account.id);
  const balances = await calculateAccountBalances(accountIds);

  // Add calculated balances to accounts
  const accountsWithBalances = accounts.map((account) => ({
    ...account,
    balance: balances.get(account.id) ?? "0",
  }));

  logger.info(
    { userId, count: accountsWithBalances.length },
    "Retrieved user accounts",
  );
  return accountsWithBalances;
}

/**
 * Gets monthly transaction statistics for a user.
 * Calculates total income, total expenses, and net cash flow for the current month.
 * Returns amounts grouped by currency for conversion.
 * Excludes soft-deleted transactions and transfers.
 */
export async function getMonthlyTransactionStats(userId: string) {
  logger.debug({ userId }, "Fetching monthly transaction stats");

  // Get first day of current month and today
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1); // End of today

  // Fetch income and expenses for current month, grouped by currency
  const results = await db
    .select({
      type: transactions.type,
      currency: financialAccounts.currency,
      total: sql<string>`
        COALESCE(SUM(${transactions.amount}), 0)
      `,
    })
    .from(transactions)
    .innerJoin(
      financialAccounts,
      eq(transactions.accountId, financialAccounts.id),
    )
    .where(
      and(
        eq(transactions.userId, userId),
        isNull(transactions.deletedAt),
        gte(transactions.date, firstDayOfMonth),
        lte(transactions.date, today),
        or(eq(transactions.type, "income"), eq(transactions.type, "expense")),
      ),
    )
    .groupBy(transactions.type, financialAccounts.currency);

  // Initialize totals by currency
  const incomeByCurrency: Record<string, string> = {};
  const expensesByCurrency: Record<string, string> = {};

  for (const result of results) {
    const currency = result.currency || "USD";
    const total = result.total || "0";

    if (result.type === "income") {
      incomeByCurrency[currency] = (
        Number.parseFloat(incomeByCurrency[currency] || "0") +
        Number.parseFloat(total)
      ).toString();
    } else if (result.type === "expense") {
      expensesByCurrency[currency] = (
        Number.parseFloat(expensesByCurrency[currency] || "0") +
        Number.parseFloat(total)
      ).toString();
    }
  }

  logger.info(
    { userId, incomeByCurrency, expensesByCurrency },
    "Retrieved monthly transaction stats",
  );

  return {
    incomeByCurrency,
    expensesByCurrency,
  };
}
