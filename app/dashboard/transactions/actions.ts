"use server";

import { and, eq } from "drizzle-orm";
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
