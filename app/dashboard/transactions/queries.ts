import {
  and,
  asc,
  between,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  isNull,
  lte,
  or,
  type SQL,
  sql,
} from "drizzle-orm";
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
 * Fetches all transactions for a user without pagination.
 * Used for client-side filtering, sorting, and pagination.
 * Joins with accounts and categories for display.
 * Excludes soft-deleted transactions.
 */
export async function getAllTransactions(userId: string) {
  logger.debug({ userId }, "Fetching all user transactions");

  // Base conditions: user's transactions, not deleted
  const whereConditions: SQL[] = [
    eq(transactions.userId, userId),
    isNull(transactions.deletedAt),
  ];

  // Fetch all transactions with joins
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
      vendor: transactions.vendor,
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
    .orderBy(desc(transactions.date));

  logger.info(
    { userId, count: transactionsData.length },
    "Retrieved all user transactions",
  );

  return transactionsData.map((t) => ({
    ...t,
    type: t.type as "income" | "expense" | "transfer",
  }));
}

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
  const whereConditions: SQL[] = [
    eq(transactions.userId, userId),
    isNull(transactions.deletedAt),
  ];

  // Apply filters
  if (filters?.search) {
    whereConditions.push(
      ilike(transactions.description, `%${filters.search}%`),
    );
  }

  if (filters?.accountIds && filters.accountIds.length > 0) {
    whereConditions.push(inArray(transactions.accountId, filters.accountIds));
  }

  if (filters?.categoryIds && filters.categoryIds.length > 0) {
    const categoryCondition = or(
      inArray(transactions.categoryId, filters.categoryIds),
      ...(filters.categoryIds.includes("uncategorized")
        ? [isNull(transactions.categoryId)]
        : []),
    );
    if (categoryCondition) {
      whereConditions.push(categoryCondition);
    }
  }

  if (filters?.types && filters.types.length > 0) {
    whereConditions.push(inArray(transactions.type, filters.types));
  }

  if (filters?.dateFrom && filters?.dateTo) {
    whereConditions.push(
      between(transactions.date, filters.dateFrom, filters.dateTo),
    );
  } else if (filters?.dateFrom) {
    whereConditions.push(gte(transactions.date, filters.dateFrom));
  } else if (filters?.dateTo) {
    whereConditions.push(lte(transactions.date, filters.dateTo));
  }

  if (filters?.amountMin !== undefined && filters?.amountMax !== undefined) {
    const amountCondition = and(
      gte(
        sql`CAST(${transactions.amount} AS DECIMAL)`,
        filters.amountMin.toString(),
      ),
      lte(
        sql`CAST(${transactions.amount} AS DECIMAL)`,
        filters.amountMax.toString(),
      ),
    );
    if (amountCondition) {
      whereConditions.push(amountCondition);
    }
  } else if (filters?.amountMin !== undefined) {
    whereConditions.push(
      gte(
        sql`CAST(${transactions.amount} AS DECIMAL)`,
        filters.amountMin.toString(),
      ),
    );
  } else if (filters?.amountMax !== undefined) {
    whereConditions.push(
      lte(
        sql`CAST(${transactions.amount} AS DECIMAL)`,
        filters.amountMax.toString(),
      ),
    );
  }

  // Determine sort order
  let orderByClause: ReturnType<typeof asc | typeof desc>;
  if (sort) {
    const direction = sort.direction === "asc" ? asc : desc;
    switch (sort.field) {
      case "date":
        orderByClause = direction(transactions.date);
        break;
      case "amount":
        orderByClause = direction(sql`CAST(${transactions.amount} AS DECIMAL)`);
        break;
      case "description":
        orderByClause = direction(transactions.description);
        break;
      case "type":
        orderByClause = direction(transactions.type);
        break;
      default:
        orderByClause = desc(transactions.date);
    }
  } else {
    orderByClause = desc(transactions.date);
  }

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
      vendor: transactions.vendor,
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
    .orderBy(orderByClause)
    .limit(pageSize)
    .offset(offset);

  // Count the total number of filtered results
  const totalCountResult = await db
    .select()
    .from(transactions)
    .where(and(...whereConditions));

  const total = totalCountResult.length;
  const totalPages = Math.ceil(total / pageSize);

  // Count total unfiltered transactions (only base conditions, no filters)
  // This is used to determine if the user has ANY transactions at all,
  // so we can show the "No transactions yet" empty state only for genuinely new users,
  // not when filters temporarily exclude all results
  const baseConditions: SQL[] = [
    eq(transactions.userId, userId),
    isNull(transactions.deletedAt),
  ];
  const totalUnfilteredResult = await db
    .select()
    .from(transactions)
    .where(and(...baseConditions));

  const totalUnfiltered = totalUnfilteredResult.length;

  logger.info(
    {
      userId,
      page,
      pageSize,
      total,
      totalUnfiltered,
      count: transactionsData.length,
    },
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
    totalUnfiltered,
  };
}
