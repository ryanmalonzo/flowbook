import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { exchangeRates } from "@/db/schema/budget";
import { fetchExchangeRates, SAME_CURRENCY_RATE } from "@/lib/api/frankfurter";
import { generateId } from "@/lib/nanoid";
import type { CurrencyCode } from "@/lib/types/currency";

const EXPIRATION_HOURS = 12;

export async function getExchangeRate(
  from: CurrencyCode,
  to: CurrencyCode,
): Promise<number> {
  if (from === to) {
    return SAME_CURRENCY_RATE;
  }

  const cached = await db
    .select()
    .from(exchangeRates)
    .where(
      and(
        eq(exchangeRates.baseCurrency, from),
        eq(exchangeRates.targetCurrency, to),
        gt(exchangeRates.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (cached.length > 0) {
    return Number(cached[0].rate);
  }

  const rates = await fetchExchangeRates(from);
  const rate = rates[to];

  if (!rate) {
    throw new Error(`Exchange rate not found for ${from} to ${to}`);
  }

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + EXPIRATION_HOURS);

  const existing = await db
    .select()
    .from(exchangeRates)
    .where(
      and(
        eq(exchangeRates.baseCurrency, from),
        eq(exchangeRates.targetCurrency, to),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(exchangeRates)
      .set({
        rate: rate.toString(),
        expiresAt,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(exchangeRates.baseCurrency, from),
          eq(exchangeRates.targetCurrency, to),
        ),
      );
  } else {
    await db.insert(exchangeRates).values({
      id: generateId(),
      baseCurrency: from,
      targetCurrency: to,
      rate: rate.toString(),
      expiresAt,
    });
  }

  return rate;
}

export async function getExchangeRates(
  from: CurrencyCode,
  toCurrencies: CurrencyCode[],
): Promise<Record<CurrencyCode, number>> {
  const uniqueCurrencies = Array.from(
    new Set(toCurrencies.filter((c) => c !== from)),
  );

  if (uniqueCurrencies.length === 0) {
    // All currencies match the base, return base at rate 1.0
    return { [from]: SAME_CURRENCY_RATE } as Record<CurrencyCode, number>;
  }

  const cachedResults = await db
    .select()
    .from(exchangeRates)
    .where(
      and(
        eq(exchangeRates.baseCurrency, from),
        gt(exchangeRates.expiresAt, new Date()),
      ),
    );

  const cachedMap = new Map<CurrencyCode, number>();

  for (const cached of cachedResults) {
    const currency = cached.targetCurrency as CurrencyCode;
    if (uniqueCurrencies.includes(currency)) {
      cachedMap.set(currency, Number(cached.rate));
    }
  }

  const needsFetch = uniqueCurrencies.filter((c) => !cachedMap.has(c));
  const result: Record<CurrencyCode, number> = {} as Record<
    CurrencyCode,
    number
  >;

  for (const [currency, rate] of cachedMap) {
    result[currency] = rate;
  }

  if (needsFetch.length > 0) {
    const rates = await fetchExchangeRates(from);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + EXPIRATION_HOURS);

    for (const toCurrency of needsFetch) {
      const rate = rates[toCurrency];

      if (rate !== undefined) {
        result[toCurrency] = rate;

        const existing = await db
          .select()
          .from(exchangeRates)
          .where(
            and(
              eq(exchangeRates.baseCurrency, from),
              eq(exchangeRates.targetCurrency, toCurrency),
            ),
          )
          .limit(1);

        if (existing.length > 0) {
          await db
            .update(exchangeRates)
            .set({
              rate: rate.toString(),
              expiresAt,
              updatedAt: new Date(),
            })
            .where(
              and(
                eq(exchangeRates.baseCurrency, from),
                eq(exchangeRates.targetCurrency, toCurrency),
              ),
            );
        } else {
          await db.insert(exchangeRates).values({
            id: generateId(),
            baseCurrency: from,
            targetCurrency: toCurrency,
            rate: rate.toString(),
            expiresAt,
          });
        }
      }
    }
  }

  return result;
}
