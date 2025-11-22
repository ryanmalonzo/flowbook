"use server";

import { and, eq, inArray, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/db";
import { categories, transactions } from "@/db/schema/budget";
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

interface DeleteCategoryResult {
  success: boolean;
  error?: string;
}

export async function deleteCategory(
  categoryId: string,
): Promise<DeleteCategoryResult> {
  try {
    const user = await getRequiredUser();
    logger.debug({ userId: user.id, categoryId }, "Deleting category");

    const existingCategory = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.id, categoryId),
          eq(categories.userId, user.id),
          isNull(categories.deletedAt),
        ),
      )
      .limit(1);

    if (existingCategory.length === 0) {
      logger.warn(
        { userId: user.id, categoryId },
        "Category not found or access denied",
      );
      return {
        success: false,
        error: "Category not found",
      };
    }

    await db
      .update(transactions)
      .set({
        categoryId: null,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(transactions.categoryId, categoryId),
          eq(transactions.userId, user.id),
          isNull(transactions.deletedAt),
        ),
      );

    await db
      .update(categories)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(eq(categories.id, categoryId), eq(categories.userId, user.id)),
      );

    logger.info(
      { userId: user.id, categoryId },
      "Category deleted successfully",
    );

    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard/transactions");

    return { success: true };
  } catch (error) {
    logger.error({ error }, "Failed to delete category");
    return {
      success: false,
      error: "Failed to delete category",
    };
  }
}

interface BulkDeleteCategoriesResult {
  success: boolean;
  deletedCount: number;
  failedCount: number;
  errors: string[];
}

export async function bulkDeleteCategories(
  categoryIds: string[],
): Promise<BulkDeleteCategoriesResult> {
  try {
    const user = await getRequiredUser();
    logger.debug(
      { userId: user.id, categoryIds, count: categoryIds.length },
      "Bulk deleting categories",
    );

    if (categoryIds.length === 0) {
      return {
        success: true,
        deletedCount: 0,
        failedCount: 0,
        errors: [],
      };
    }

    const existingCategories = await db
      .select()
      .from(categories)
      .where(
        and(
          inArray(categories.id, categoryIds),
          eq(categories.userId, user.id),
          isNull(categories.deletedAt),
        ),
      );

    if (existingCategories.length === 0) {
      logger.warn(
        { userId: user.id, categoryIds },
        "No valid categories found for bulk delete",
      );
      return {
        success: false,
        deletedCount: 0,
        failedCount: categoryIds.length,
        errors: ["No valid categories found"],
      };
    }

    const validCategoryIds = existingCategories.map((category) => category.id);

    await db
      .update(transactions)
      .set({
        categoryId: null,
        updatedAt: new Date(),
      })
      .where(
        and(
          inArray(transactions.categoryId, validCategoryIds),
          eq(transactions.userId, user.id),
          isNull(transactions.deletedAt),
        ),
      );

    await db
      .update(categories)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          inArray(categories.id, validCategoryIds),
          eq(categories.userId, user.id),
        ),
      );

    const deletedCount = validCategoryIds.length;

    logger.info(
      {
        userId: user.id,
        deletedCount,
        categoryIds: validCategoryIds,
      },
      "Bulk delete categories completed",
    );

    revalidatePath("/dashboard/categories");
    revalidatePath("/dashboard/transactions");

    return {
      success: true,
      deletedCount,
      failedCount: categoryIds.length - deletedCount,
      errors: [],
    };
  } catch (error) {
    logger.error({ error }, "Failed to bulk delete categories");
    return {
      success: false,
      deletedCount: 0,
      failedCount: categoryIds.length,
      errors: ["Failed to delete categories"],
    };
  }
}
