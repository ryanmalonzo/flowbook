import type { CurrencyCode } from "@/lib/types/currency";
import { FALLBACK_RATES } from "@/lib/types/currency";

export const SAME_CURRENCY_RATE = 1.0;

interface FrankfurterResponse {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

const FRANKFURTER_API_BASE = "https://api.frankfurter.dev";

/**
 * Fetches exchange rates from Frankfurter API
 * Falls back to hardcoded FALLBACK_RATES if API call fails
 *
 * @param base - Base currency code (defaults to USD)
 * @returns Exchange rates object with target currencies as keys
 */
export async function fetchExchangeRates(
  base: CurrencyCode = "USD",
): Promise<Record<CurrencyCode, number>> {
  try {
    const response = await fetch(
      `${FRANKFURTER_API_BASE}/v1/latest?base=${base}`,
      {
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      throw new Error(`Frankfurter API error: ${response.status}`);
    }

    const data = (await response.json()) as FrankfurterResponse;

    // API returns rates for all currencies except base, so we add base as 1.0
    const rates: Record<CurrencyCode, number> = {} as Record<
      CurrencyCode,
      number
    >;
    rates[base] = SAME_CURRENCY_RATE;

    for (const [currency, rate] of Object.entries(data.rates)) {
      if (currency in FALLBACK_RATES || currency === "USD") {
        rates[currency as CurrencyCode] = rate;
      }
    }

    return rates;
  } catch (error) {
    console.warn("Failed to fetch exchange rates from Frankfurter:", error);

    if (base === "USD") {
      const fallback: Record<CurrencyCode, number> = {
        USD: 1.0,
        ...FALLBACK_RATES,
      };
      return fallback;
    }

    // For non-USD base, we'd need to calculate from USD rates
    // For now, return USD-based fallback with warning
    console.warn(
      `Non-USD base currency requested (${base}), but fallback rates are USD-based`,
    );
    const fallback: Record<CurrencyCode, number> = {
      USD: 1.0,
      ...FALLBACK_RATES,
    };
    return fallback;
  }
}
