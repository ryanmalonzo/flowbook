import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/db";
import { categories } from "@/db/schema/budget";
import logger from "@/lib/logger";

export async function getUserCategories(userId: string) {
  logger.debug({ userId }, "Fetching user categories");

  const userCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
      color: categories.color,
      icon: categories.icon,
    })
    .from(categories)
    .where(and(eq(categories.userId, userId), isNull(categories.deletedAt)))
    .orderBy(categories.name);

  logger.info(
    { userId, count: userCategories.length },
    "Retrieved user categories",
  );
  return userCategories;
}
