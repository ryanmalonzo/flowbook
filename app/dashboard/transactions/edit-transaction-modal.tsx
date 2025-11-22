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
import { updateTransaction } from "./actions";
import type { Transaction } from "./types";

interface Category {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
}

interface Account {
  id: string;
  name: string;
  type: "checking" | "savings";
  balance: string | null;
  currency: string | null;
}

interface EditTransactionModalProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  accounts: Account[];
}

export function EditTransactionModal({
  transaction,
  open,
  onOpenChange,
  categories,
  accounts,
}: EditTransactionModalProps) {
  const t = useTranslations("transactions.edit");
  const formId = React.useId();
  const dateId = React.useId();
  const descriptionId = React.useId();
  const amountId = React.useId();
  const vendorId = React.useId();

  const [date, setDate] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [type, setType] = React.useState<"income" | "expense" | "transfer">(
    "expense",
  );
  const [categoryId, setCategoryId] = React.useState<string | null>(null);
  const [accountId, setAccountId] = React.useState("");
  const [vendor, setVendor] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (transaction) {
      const transactionDate = new Date(transaction.date);
      const formattedDate = transactionDate.toISOString().split("T")[0];
      setDate(formattedDate);
      setDescription(transaction.description);
      setAmount(transaction.amount);
      setType(transaction.type);
      setCategoryId(transaction.categoryId);
      setAccountId(transaction.accountId);
      setVendor(transaction.vendor || "");
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transaction) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateTransaction({
        transactionId: transaction.id,
        date: new Date(date),
        description,
        amount,
        type,
        categoryId,
        accountId,
        vendor: vendor.trim() || null,
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
      description={t("modalDescription")}
      icon="pencil"
      primaryAction={
        <Button
          type="submit"
          form={formId}
          disabled={
            isSubmitting ||
            !date ||
            !description.trim() ||
            !amount ||
            !accountId
          }
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
          <Label htmlFor={dateId}>{t("date.label")}</Label>
          <Input
            id={dateId}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            disabled={isSubmitting}
            required={true}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={descriptionId}>
            {t("transactionDescription.label")}
          </Label>
          <Input
            id={descriptionId}
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("transactionDescription.placeholder")}
            disabled={isSubmitting}
            required={true}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={amountId}>{t("amount.label")}</Label>
          <Input
            id={amountId}
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t("amount.placeholder")}
            disabled={isSubmitting}
            required={true}
          />
        </div>

        <div className="space-y-2">
          <Label>{t("type.label")}</Label>
          <Select
            value={type}
            onValueChange={(value) =>
              setType(value as "income" | "expense" | "transfer")
            }
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
              <SelectItem value="transfer">Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("category.label")}</Label>
          <Select
            value={categoryId || "none"}
            onValueChange={(value) =>
              setCategoryId(value === "none" ? null : value)
            }
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("category.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                <em>No category</em>
              </SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("account.label")}</Label>
          <Select
            value={accountId}
            onValueChange={setAccountId}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("account.placeholder")} />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor={vendorId}>{t("vendor.label")}</Label>
          <Input
            id={vendorId}
            type="text"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            placeholder={t("vendor.placeholder")}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </ActionDialog>
  );
}
