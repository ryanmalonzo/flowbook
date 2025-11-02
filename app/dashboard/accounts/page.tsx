import { SAME_CURRENCY_RATE } from "@/lib/api/frankfurter";
import { getRequiredUser } from "@/lib/auth/utils";
import { getExchangeRate } from "@/lib/queries/exchange-rates";
import { getUserSettings } from "@/lib/queries/settings";
import type { CurrencyCode } from "@/lib/types/currency";
import { convertCurrency } from "@/lib/utils";
import AccountsClient from "./accounts-client";
import { getUserAccounts } from "./queries";

export default async function AccountsPage() {
  const user = await getRequiredUser();

  const [accounts, settings] = await Promise.all([
    getUserAccounts(user.id),
    getUserSettings(user.id),
  ]);

  const defaultCurrency = settings.currency as CurrencyCode;

  // Collect unique currencies from accounts (excluding default currency)
  const accountCurrencies = new Set<CurrencyCode>(
    accounts
      .map((account) => account.currency || "USD")
      .filter((c) => c !== defaultCurrency) as CurrencyCode[],
  );

  // Fetch exchange rates from each account currency to default currency
  const exchangeRates: Record<CurrencyCode, number> = {} as Record<
    CurrencyCode,
    number
  >;
  exchangeRates[defaultCurrency] = SAME_CURRENCY_RATE;

  const ratePromises = Array.from(accountCurrencies).map(async (currency) => {
    const rate = await getExchangeRate(currency, defaultCurrency);
    return { currency, rate };
  });

  const rates = await Promise.all(ratePromises);
  for (const { currency, rate } of rates) {
    exchangeRates[currency] = rate;
  }

  // Convert account balances to default currency for stat card calculations
  const accountsWithConvertedBalances = accounts.map((account) => {
    const balance = Number.parseFloat(account.balance || "0");
    const accountCurrency = (account.currency || "USD") as CurrencyCode;

    const convertedBalance =
      accountCurrency === defaultCurrency
        ? balance
        : convertCurrency(balance, exchangeRates[accountCurrency] || 1);

    return {
      ...account,
      convertedBalance,
    };
  });

  return (
    <AccountsClient
      accounts={accountsWithConvertedBalances}
      defaultCurrency={defaultCurrency}
    />
  );
}
