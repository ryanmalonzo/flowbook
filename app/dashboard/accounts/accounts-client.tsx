"use client";

import {
  ArrowDownCircle,
  ArrowUpCircle,
  PiggyBank,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { EntityCard } from "@/components/shared/entity-card";
import { MetricCard } from "@/components/shared/metric-card";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface Account {
  id: string;
  name: string;
  type: "checking" | "savings";
  balance: string | null;
  currency: string | null;
  convertedBalance?: number; // Balance converted to default currency for totals
}

interface AccountsClientProps {
  accounts: Account[];
  defaultCurrency: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  netCashFlow: number;
}

const accountTypeIcons = {
  checking: Wallet,
  savings: PiggyBank,
};

const accountTypeColors = {
  checking:
    "bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20",
  savings: "bg-chart-2/10 text-chart-2 hover:bg-chart-2/20",
};

export default function AccountsClient({
  accounts,
  defaultCurrency,
  monthlyIncome,
  monthlyExpenses,
  netCashFlow,
}: AccountsClientProps) {
  const t = useTranslations();

  // Calculate assets (checking + savings) using converted balances
  const assets = accounts.reduce((sum, account) => {
    const balance =
      account.convertedBalance ?? Number.parseFloat(account.balance || "0");
    return sum + balance;
  }, 0);

  const isPositiveCashFlow = netCashFlow >= 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={PiggyBank}
          label={t("accounts.assets")}
          value={assets}
          currency={defaultCurrency}
        />

        <MetricCard
          icon={ArrowUpCircle}
          label={t("accounts.monthlyIncome")}
          value={monthlyIncome}
          currency={defaultCurrency}
          valueColor="green"
        />

        <MetricCard
          icon={ArrowDownCircle}
          label={t("accounts.monthlyExpenses")}
          value={monthlyExpenses}
          currency={defaultCurrency}
          valueColor="red"
        />

        <MetricCard
          icon={TrendingUp}
          label={t("accounts.netCashFlow")}
          value={netCashFlow}
          currency={defaultCurrency}
          valueColor={isPositiveCashFlow ? "green" : "red"}
          tooltip={t("accounts.netCashFlowTooltip")}
        />
      </div>

      {accounts.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader className="pt-12 pb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Wallet className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">
              {t("accounts.empty.title")}
            </CardTitle>
            <CardDescription className="text-base">
              {t("accounts.empty.description")}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => {
            const Icon = accountTypeIcons[account.type];
            const balance = Number.parseFloat(account.balance || "0");
            const currency = account.currency || "USD";

            return (
              <EntityCard
                key={account.id}
                icon={Icon}
                title={account.name}
                badge={
                  <Badge
                    variant="secondary"
                    className={accountTypeColors[account.type]}
                  >
                    {t(`accounts.accountType.${account.type}`)}
                  </Badge>
                }
                contentLabel={t("accounts.balance")}
                contentValue={balance}
                contentFormatter={(value) =>
                  formatCurrency(Number(value), currency)
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
