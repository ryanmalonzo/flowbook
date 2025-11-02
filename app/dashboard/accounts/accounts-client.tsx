"use client";

import { CreditCard, Info, Landmark, PiggyBank, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Account {
  id: string;
  name: string;
  type: "checking" | "savings" | "credit";
  balance: string | null;
  currency: string | null;
}

interface AccountsClientProps {
  accounts: Account[];
}

const accountTypeIcons = {
  checking: Wallet,
  savings: PiggyBank,
  credit: CreditCard,
};

const accountTypeColors = {
  checking: "bg-primary/10 text-primary hover:bg-primary/20",
  savings: "bg-chart-2/10 text-chart-2 hover:bg-chart-2/20",
  credit: "bg-destructive/10 text-destructive hover:bg-destructive/20",
};

export default function AccountsClient({ accounts }: AccountsClientProps) {
  const t = useTranslations();

  // Calculate assets (checking + savings)
  const assets = accounts
    .filter(
      (account) => account.type === "checking" || account.type === "savings",
    )
    .reduce((sum, account) => {
      const balance = Number.parseFloat(account.balance || "0");
      return sum + balance;
    }, 0);

  // Calculate debts (credit cards)
  const debts = accounts
    .filter((account) => account.type === "credit")
    .reduce((sum, account) => {
      const balance = Number.parseFloat(account.balance || "0");
      return sum + balance;
    }, 0);

  // Calculate net worth (assets - debts)
  const netWorth = assets - debts;

  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Financial Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* Assets Card */}
        <Card className="border-2">
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <PiggyBank className="h-4 w-4" />
              {t("accounts.assets")}
            </CardDescription>
            <CardTitle className="font-bold text-4xl">
              {formatCurrency(assets)}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Debts Card */}
        <Card className="border-2">
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              {t("accounts.debts")}
            </CardDescription>
            <CardTitle className="font-bold text-4xl">
              {formatCurrency(debts)}
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Net Worth Card */}
        <Card className="border-2">
          <CardHeader>
            <CardDescription className="flex items-center gap-2">
              <Landmark className="h-4 w-4" />
              {t("accounts.netWorth")}
              <Tooltip>
                <TooltipTrigger asChild={true}>
                  <Info className="h-4 w-4 cursor-help text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-wrap">{t("accounts.netWorthTooltip")}</p>
                </TooltipContent>
              </Tooltip>
            </CardDescription>
            <CardTitle className="font-bold text-4xl">
              {formatCurrency(netWorth)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Accounts Grid */}
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
              <Card
                key={account.id}
                className="transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-muted p-2">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className={accountTypeColors[account.type]}
                    >
                      {t(`accounts.accountType.${account.type}`)}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4">{account.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-sm">
                      {t("accounts.balance")}
                    </span>
                    <span className="font-semibold text-2xl">
                      {formatCurrency(balance, currency)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
