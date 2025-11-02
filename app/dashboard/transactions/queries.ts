import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import {
  categories,
  financialAccounts,
  transactions,
} from "@/db/schema/budget";
import logger from "@/lib/logger";
import type {
  GetTransactionsResult,
  PaginationParams,
  TransactionFilters,
  TransactionSort,
} from "./types";

/**
 * Fetches transactions for a user with pagination.
 * Joins with accounts and categories for display.
 * Excludes soft-deleted transactions.
 */
export async function getTransactions(
  userId: string,
  pagination: PaginationParams,
  filters?: TransactionFilters,
  sort?: TransactionSort,
): Promise<GetTransactionsResult> {
  logger.debug(
    { userId, pagination, filters, sort },
    "Fetching user transactions",
  );

  const { page, pageSize } = pagination;
  const offset = (page - 1) * pageSize;

  // Build the where clause
  const whereConditions = [
    eq(transactions.userId, userId),
    isNull(transactions.deletedAt),
  ];

  // TODO: Apply filters when implementing filter functionality
  // if (filters?.search) { ... }
  // if (filters?.accountIds?.length) { ... }
  // if (filters?.categoryIds?.length) { ... }
  // if (filters?.types?.length) { ... }
  // if (filters?.dateFrom) { ... }
  // if (filters?.dateTo) { ... }
  // if (filters?.amountMin !== undefined) { ... }
  // if (filters?.amountMax !== undefined) { ... }

  // Fetch transactions with joins
  const transactionsData = await db
    .select({
      id: transactions.id,
      userId: transactions.userId,
      accountId: transactions.accountId,
      accountName: financialAccounts.name,
      categoryId: transactions.categoryId,
      categoryName: categories.name,
      categoryColor: categories.color,
      categoryIcon: categories.icon,
      amount: transactions.amount,
      description: transactions.description,
      date: transactions.date,
      type: transactions.type,
      createdAt: transactions.createdAt,
      updatedAt: transactions.updatedAt,
    })
    .from(transactions)
    .leftJoin(
      financialAccounts,
      eq(transactions.accountId, financialAccounts.id),
    )
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(and(...whereConditions))
    .orderBy(desc(transactions.date)) // TODO: Apply sort when implementing sort functionality
    .limit(pageSize)
    .offset(offset);

  // Count the total number of results
  const totalCountResult = await db
    .select()
    .from(transactions)
    .where(and(...whereConditions));

  const total = totalCountResult.length;
  const totalPages = Math.ceil(total / pageSize);

  logger.info(
    { userId, page, pageSize, total, count: transactionsData.length },
    "Retrieved user transactions",
  );

  return {
    transactions: transactionsData.map((t) => ({
      ...t,
      type: t.type as "income" | "expense" | "transfer",
    })),
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
}
