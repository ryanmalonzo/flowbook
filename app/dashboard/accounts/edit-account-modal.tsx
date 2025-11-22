"use client";

import { useTranslations } from "next-intl";
import * as React from "react";
import { toast } from "sonner";

import { ActionDialog } from "@/components/shared/action-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCY_CODES, type CurrencyCode } from "@/lib/types/currency";
import { updateAccount } from "./actions";

interface Account {
  id: string;
  name: string;
  type: "checking" | "savings";
  balance: string | null;
  currency: string | null;
}

interface EditAccountModalProps {
  account: Account | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditAccountModal({
  account,
  open,
  onOpenChange,
}: EditAccountModalProps) {
  const t = useTranslations("accounts.edit");
  const accountNameId = React.useId();
  const formId = React.useId();
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<"checking" | "savings">("checking");
  const [currency, setCurrency] = React.useState<CurrencyCode>("USD");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (account) {
      setName(account.name);
      setType(account.type);
      setCurrency((account.currency || "USD") as CurrencyCode);
    }
  }, [account]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!account) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateAccount({
        accountId: account.id,
        name,
        type,
        currency,
      });

      if (result.success) {
        toast.success(t("success"));
        onOpenChange(false);
      } else {
        toast.error(result.error || t("error"));
      }
    } catch {
      toast.error(t("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("title")}
      description={t("description")}
      icon="pencil"
      primaryAction={
        <Button
          type="submit"
          form={formId}
          disabled={isSubmitting || !name.trim()}
        >
          {t("save")}
        </Button>
      }
      secondaryAction={
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isSubmitting}
        >
          {t("cancel")}
        </Button>
      }
    >
      <form id={formId} onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={accountNameId}>{t("name.label")}</Label>
          <Input
            id={accountNameId}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("name.placeholder")}
            disabled={isSubmitting}
            required={true}
          />
        </div>

        <div className="space-y-2">
          <Label>{t("type.label")}</Label>
          <Select
            value={type}
            onValueChange={(value) => setType(value as "checking" | "savings")}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="checking">Checking</SelectItem>
              <SelectItem value="savings">Savings</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("currency.label")}</Label>
          <Select
            value={currency}
            onValueChange={(value) => setCurrency(value as CurrencyCode)}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCY_CODES.map((curr) => (
                <SelectItem key={curr} value={curr}>
                  {curr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </form>
    </ActionDialog>
  );
}
