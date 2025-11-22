"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { categories } from "@/db/schema/budget";
import { getRequiredUser } from "@/lib/auth/utils";
import logger from "@/lib/logger";

interface UpdateCategoryParams {
  categoryId: string;
  name: string;
  color: string;
  icon: string;
}

interface UpdateCategoryResult {
  success: boolean;
  error?: string;
}

export async function updateCategory(
  params: UpdateCategoryParams,
): Promise<UpdateCategoryResult> {
  try {
    const user = await getRequiredUser();
    logger.debug(
      { userId: user.id, categoryId: params.categoryId },
      "Updating category",
    );

    const existingCategory = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.id, params.categoryId),
          eq(categories.userId, user.id),
        ),
      )
      .limit(1);

    if (existingCategory.length === 0) {
      logger.warn(
        { userId: user.id, categoryId: params.categoryId },
        "Category not found or access denied",
      );
      return {
        success: false,
        error: "Category not found",
      };
    }

    await db
      .update(categories)
      .set({
        name: params.name,
        color: params.color,
        icon: params.icon,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(categories.id, params.categoryId),
          eq(categories.userId, user.id),
        ),
      );

    logger.info(
      { userId: user.id, categoryId: params.categoryId },
      "Category updated successfully",
    );

    revalidatePath("/dashboard/categories");

    return { success: true };
  } catch (error) {
    logger.error({ error }, "Failed to update category");
    return {
      success: false,
      error: "Failed to update category",
    };
  }
}
