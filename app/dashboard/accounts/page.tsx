import { SAME_CURRENCY_RATE } from "@/lib/api/frankfurter";
import { getRequiredUser } from "@/lib/auth/utils";
import { getExchangeRate } from "@/lib/queries/exchange-rates";
import { getUserSettings } from "@/lib/queries/settings";
import type { CurrencyCode } from "@/lib/types/currency";
import { convertCurrency } from "@/lib/utils";
import AccountsClient from "./accounts-client";
import { getMonthlyTransactionStats, getUserAccounts } from "./queries";

export default async function AccountsPage() {
  const user = await getRequiredUser();

  const [accounts, settings, monthlyStats] = await Promise.all([
    getUserAccounts(user.id),
    getUserSettings(user.id),
    getMonthlyTransactionStats(user.id),
  ]);

  const defaultCurrency = settings.currency as CurrencyCode;

  // Collect unique currencies from accounts and transaction stats (excluding default currency)
  const accountCurrencies = new Set<CurrencyCode>(
    [
      ...accounts.map((account) => account.currency || "USD"),
      ...Object.keys(monthlyStats.incomeByCurrency),
      ...Object.keys(monthlyStats.expensesByCurrency),
    ].filter((c) => c !== defaultCurrency) as CurrencyCode[],
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

  // Convert monthly transaction stats to default currency
  let monthlyIncome = 0;
  let monthlyExpenses = 0;

  for (const [currency, amount] of Object.entries(
    monthlyStats.incomeByCurrency,
  )) {
    const currencyCode = (currency || "USD") as CurrencyCode;
    const amountNum = Number.parseFloat(amount);
    monthlyIncome +=
      currencyCode === defaultCurrency
        ? amountNum
        : convertCurrency(amountNum, exchangeRates[currencyCode] || 1);
  }

  for (const [currency, amount] of Object.entries(
    monthlyStats.expensesByCurrency,
  )) {
    const currencyCode = (currency || "USD") as CurrencyCode;
    const amountNum = Number.parseFloat(amount);
    monthlyExpenses +=
      currencyCode === defaultCurrency
        ? amountNum
        : convertCurrency(amountNum, exchangeRates[currencyCode] || 1);
  }

  const netCashFlow = monthlyIncome - monthlyExpenses;

  return (
    <AccountsClient
      accounts={accountsWithConvertedBalances}
      defaultCurrency={defaultCurrency}
      monthlyIncome={monthlyIncome}
      monthlyExpenses={monthlyExpenses}
      netCashFlow={netCashFlow}
    />
  );
}
