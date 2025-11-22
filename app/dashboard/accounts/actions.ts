"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { financialAccounts } from "@/db/schema/budget";
import { getRequiredUser } from "@/lib/auth/utils";
import logger from "@/lib/logger";
import type { CurrencyCode } from "@/lib/types/currency";

interface UpdateAccountParams {
  accountId: string;
  name: string;
  type: "checking" | "savings";
  currency: CurrencyCode;
}

interface UpdateAccountResult {
  success: boolean;
  error?: string;
}

export async function updateAccount(
  params: UpdateAccountParams,
): Promise<UpdateAccountResult> {
  try {
    const user = await getRequiredUser();
    logger.debug(
      { userId: user.id, accountId: params.accountId },
      "Updating account",
    );

    const existingAccount = await db
      .select()
      .from(financialAccounts)
      .where(
        and(
          eq(financialAccounts.id, params.accountId),
          eq(financialAccounts.userId, user.id),
        ),
      )
      .limit(1);

    if (existingAccount.length === 0) {
      logger.warn(
        { userId: user.id, accountId: params.accountId },
        "Account not found or access denied",
      );
      return {
        success: false,
        error: "Account not found",
      };
    }

    await db
      .update(financialAccounts)
      .set({
        name: params.name,
        type: params.type,
        currency: params.currency,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(financialAccounts.id, params.accountId),
          eq(financialAccounts.userId, user.id),
        ),
      );

    logger.info(
      { userId: user.id, accountId: params.accountId },
      "Account updated successfully",
    );

    revalidatePath("/dashboard/accounts");

    return { success: true };
  } catch (error) {
    logger.error({ error }, "Failed to update account");
    return {
      success: false,
      error: "Failed to update account",
    };
  }
}
