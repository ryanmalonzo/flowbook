import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency using Intl.NumberFormat
 * @param amount - The numeric amount to format
 * @param currency - The currency code (ISO 4217), defaults to "USD"
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(amount: number, currency: string = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

/**
 * Converts an amount from one currency to another using an exchange rate
 * @param amount - The amount to convert
 * @param exchangeRate - The exchange rate (amount in target currency per 1 unit of source currency)
 * @returns The converted amount
 */
export function convertCurrency(amount: number, exchangeRate: number): number {
  return amount * exchangeRate;
}

/**
 * Formats a transaction date for display
 * @param date - The date to format
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatTransactionDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/**
 * Returns the appropriate color class for a transaction type badge
 * @param type - The transaction type
 * @returns Tailwind CSS color class
 */
export function getTransactionTypeColor(
  type: "income" | "expense" | "transfer",
): string {
  switch (type) {
    case "income":
      return "bg-green-500/10 text-green-700 dark:text-green-400";
    case "expense":
      return "bg-red-500/10 text-red-700 dark:text-red-400";
    case "transfer":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
  }
}

/**
 * Formats a transaction amount with currency and +/- prefix
 * @param amount - The amount to format
 * @param type - The transaction type
 * @param currency - The currency code
 * @returns Formatted amount string with prefix (e.g., "+$1,234.56")
 */
export function formatTransactionAmount(
  amount: number,
  type: "income" | "expense" | "transfer",
  currency: string = "USD",
): string {
  const formatted = formatCurrency(Math.abs(amount), currency);
  if (type === "income") {
    return `+${formatted}`;
  }
  if (type === "expense") {
    return `-${formatted}`;
  }
  return formatted;
}
