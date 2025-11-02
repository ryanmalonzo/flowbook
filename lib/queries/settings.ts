import { eq } from "drizzle-orm";
import { db } from "@/db";
import { userSettings } from "@/db/schema/budget";
import { generateId } from "@/lib/nanoid";

export async function getUserSettings(userId: string) {
  const existing = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  const newSettings = await db
    .insert(userSettings)
    .values({
      id: generateId(),
      userId,
      currency: "USD",
    })
    .returning();

  return newSettings[0];
}
