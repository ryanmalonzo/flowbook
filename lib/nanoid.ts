import { nanoid } from "nanoid";

export const NANOID_LENGTH = 12;

/**
 * Generates a nanoid with a consistent length of 12 characters
 * Uses the default alphabet (URL-safe characters: A-Za-z0-9_-)
 */
export function generateId(): string {
  return nanoid(NANOID_LENGTH);
}
