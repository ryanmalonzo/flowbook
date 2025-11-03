/**
 * Supported currency codes from Frankfurter API
 * Based on https://api.frankfurter.dev response
 */
export type CurrencyCode =
  | "AUD"
  | "BGN"
  | "BRL"
  | "CAD"
  | "CHF"
  | "CNY"
  | "CZK"
  | "DKK"
  | "EUR"
  | "GBP"
  | "HKD"
  | "HUF"
  | "IDR"
  | "ILS"
  | "INR"
  | "ISK"
  | "JPY"
  | "KRW"
  | "MXN"
  | "MYR"
  | "NOK"
  | "NZD"
  | "PHP"
  | "PLN"
  | "RON"
  | "SEK"
  | "SGD"
  | "THB"
  | "TRY"
  | "USD"
  | "ZAR";

/**
 * Default currency code used throughout the application
 * Used as fallback when user currency is not set
 */
export const DEFAULT_CURRENCY: CurrencyCode = "USD";

/**
 * Fallback exchange rates (USD base)
 * Used when API fails or rates have expired
 * Last updated: 2025-10-31
 */
export const FALLBACK_RATES: Record<Exclude<CurrencyCode, "USD">, number> = {
  AUD: 1.5295,
  BGN: 1.6927,
  BRL: 5.3809,
  CAD: 1.4027,
  CHF: 0.80379,
  CNY: 7.1162,
  CZK: 21.055,
  DKK: 6.4633,
  EUR: 0.8655,
  GBP: 0.76303,
  HKD: 7.7711,
  HUF: 335.9,
  IDR: 16662,
  ILS: 3.2494,
  INR: 88.72,
  ISK: 125.32,
  JPY: 154.18,
  KRW: 1428.14,
  MXN: 18.5468,
  MYR: 4.188,
  NOK: 10.0818,
  NZD: 1.7494,
  PHP: 58.711,
  PLN: 3.6836,
  RON: 4.4018,
  SEK: 9.4556,
  SGD: 1.3016,
  THB: 32.325,
  TRY: 42.049,
  ZAR: 17.349,
};
