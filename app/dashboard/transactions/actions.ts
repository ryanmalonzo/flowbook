"use server";

import { and, eq, inArray, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { transactions } from "@/db/schema/budget";
import { getRequiredUser } from "@/lib/auth/utils";
import logger from "@/lib/logger";

interface UpdateTransactionParams {
  transactionId: string;
  date: Date;
  description: string;
  amount: string;
  type: "income" | "expense" | "transfer";
  categoryId: string | null;
  accountId: string;
  vendor: string | null;
}

interface UpdateTransactionResult {
  success: boolean;
  error?: string;
}

/**
 * Updates a transaction.
 *
 * Note: In the future, when bank account linking is implemented, transactions
 * imported from banking accounts may need read-only amount fields or a
 * correction/adjustment feature if the imported data is incorrect.
 */
export async function updateTransaction(
  params: UpdateTransactionParams,
): Promise<UpdateTransactionResult> {
  try {
    const user = await getRequiredUser();
    logger.debug(
      { userId: user.id, transactionId: params.transactionId },
      "Updating transaction",
    );

    const existingTransaction = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.id, params.transactionId),
          eq(transactions.userId, user.id),
        ),
      )
      .limit(1);

    if (existingTransaction.length === 0) {
      logger.warn(
        { userId: user.id, transactionId: params.transactionId },
        "Transaction not found or access denied",
      );
      return {
        success: false,
        error: "Transaction not found",
      };
    }

    await db
      .update(transactions)
      .set({
        date: params.date,
        description: params.description,
        amount: params.amount,
        type: params.type,
        categoryId: params.categoryId,
        accountId: params.accountId,
        vendor: params.vendor,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(transactions.id, params.transactionId),
          eq(transactions.userId, user.id),
        ),
      );

    logger.info(
      { userId: user.id, transactionId: params.transactionId },
      "Transaction updated successfully",
    );

    // Revalidate both transactions and accounts pages since balances are calculated from transactions
    revalidatePath("/dashboard/transactions");
    revalidatePath("/dashboard/accounts");

    return { success: true };
  } catch (error) {
    logger.error({ error }, "Failed to update transaction");
    return {
      success: false,
      error: "Failed to update transaction",
    };
  }
}

interface DeleteTransactionResult {
  success: boolean;
  error?: string;
}

export async function deleteTransaction(
  transactionId: string,
): Promise<DeleteTransactionResult> {
  try {
    const user = await getRequiredUser();
    logger.debug({ userId: user.id, transactionId }, "Deleting transaction");

    const existingTransaction = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.id, transactionId),
          eq(transactions.userId, user.id),
          isNull(transactions.deletedAt),
        ),
      )
      .limit(1);

    if (existingTransaction.length === 0) {
      logger.warn(
        { userId: user.id, transactionId },
        "Transaction not found or access denied",
      );
      return {
        success: false,
        error: "Transaction not found",
      };
    }

    await db
      .update(transactions)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(transactions.id, transactionId),
          eq(transactions.userId, user.id),
        ),
      );

    logger.info(
      { userId: user.id, transactionId },
      "Transaction deleted successfully",
    );

    // Revalidate both transactions and accounts pages since balances are calculated from transactions
    revalidatePath("/dashboard/transactions");
    revalidatePath("/dashboard/accounts");

    return { success: true };
  } catch (error) {
    logger.error({ error }, "Failed to delete transaction");
    return {
      success: false,
      error: "Failed to delete transaction",
    };
  }
}

interface BulkDeleteTransactionsResult {
  success: boolean;
  deletedCount: number;
  failedCount: number;
  errors: string[];
}

export async function bulkDeleteTransactions(
  transactionIds: string[],
): Promise<BulkDeleteTransactionsResult> {
  try {
    const user = await getRequiredUser();
    logger.debug(
      { userId: user.id, transactionIds, count: transactionIds.length },
      "Bulk deleting transactions",
    );

    if (transactionIds.length === 0) {
      return {
        success: true,
        deletedCount: 0,
        failedCount: 0,
        errors: [],
      };
    }

    const existingTransactions = await db
      .select()
      .from(transactions)
      .where(
        and(
          inArray(transactions.id, transactionIds),
          eq(transactions.userId, user.id),
          isNull(transactions.deletedAt),
        ),
      );

    if (existingTransactions.length === 0) {
      logger.warn(
        { userId: user.id, transactionIds },
        "No valid transactions found for bulk delete",
      );
      return {
        success: false,
        deletedCount: 0,
        failedCount: transactionIds.length,
        errors: ["No valid transactions found"],
      };
    }

    const validTransactionIds = existingTransactions.map(
      (transaction) => transaction.id,
    );

    await db
      .update(transactions)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          inArray(transactions.id, validTransactionIds),
          eq(transactions.userId, user.id),
        ),
      );

    const deletedCount = validTransactionIds.length;

    logger.info(
      {
        userId: user.id,
        deletedCount,
        transactionIds: validTransactionIds,
      },
      "Bulk delete transactions completed",
    );

    revalidatePath("/dashboard/transactions");
    revalidatePath("/dashboard/accounts");

    return {
      success: true,
      deletedCount,
      failedCount: transactionIds.length - deletedCount,
      errors: [],
    };
  } catch (error) {
    logger.error({ error }, "Failed to bulk delete transactions");
    return {
      success: false,
      deletedCount: 0,
      failedCount: transactionIds.length,
      errors: ["Failed to delete transactions"],
    };
  }
}
