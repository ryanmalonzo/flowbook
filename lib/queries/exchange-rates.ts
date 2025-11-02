import { and, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { exchangeRates } from "@/db/schema/budget";
import { fetchExchangeRates, SAME_CURRENCY_RATE } from "@/lib/api/frankfurter";
import logger from "@/lib/logger";
import { generateId } from "@/lib/nanoid";
import type { CurrencyCode } from "@/lib/types/currency";

const EXPIRATION_HOURS = 12;

export async function getExchangeRate(
  from: CurrencyCode,
  to: CurrencyCode,
): Promise<number> {
  if (from === to) {
    logger.debug({ from, to }, "Same currency exchange rate requested");
    return SAME_CURRENCY_RATE;
  }

  logger.debug({ from, to }, "Fetching exchange rate");

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
    logger.info({ from, to, rate: cached[0].rate }, "Exchange rate cache hit");
    return Number(cached[0].rate);
  }

  logger.info({ from, to }, "Exchange rate cache miss, fetching from API");
  const rates = await fetchExchangeRates(from);
  const rate = rates[to];

  if (!rate) {
    logger.error({ from, to }, "Exchange rate not found");
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
    logger.debug(
      { from, to, rate },
      "Updating existing exchange rate in database",
    );
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
    logger.debug(
      { from, to, rate },
      "Inserting new exchange rate into database",
    );
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

  logger.debug(
    { from, toCurrencies: uniqueCurrencies, count: uniqueCurrencies.length },
    "Fetching batch exchange rates",
  );

  if (uniqueCurrencies.length === 0) {
    logger.debug({ from }, "All currencies match base currency");
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

  logger.info(
    { from, cached: cachedMap.size, needsFetch: needsFetch.length },
    "Exchange rates batch: cache status",
  );

  const result: Record<CurrencyCode, number> = {} as Record<
    CurrencyCode,
    number
  >;

  for (const [currency, rate] of cachedMap) {
    result[currency] = rate;
  }

  if (needsFetch.length > 0) {
    logger.info(
      { from, currencies: needsFetch },
      "Fetching missing exchange rates from API",
    );
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
          logger.debug(
            { from, to: toCurrency, rate },
            "Updating exchange rate in batch",
          );
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
          logger.debug(
            { from, to: toCurrency, rate },
            "Inserting exchange rate in batch",
          );
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

  logger.info(
    { from, resultCount: Object.keys(result).length },
    "Batch exchange rates completed",
  );
  return result;
}
