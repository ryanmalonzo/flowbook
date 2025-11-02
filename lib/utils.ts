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
