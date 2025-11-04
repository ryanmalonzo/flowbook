"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, PiggyBank, Trash, Wallet } from "lucide-react";
import type { useTranslations } from "next-intl";
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/utils";

interface Account {
  id: string;
  name: string;
  type: "checking" | "savings";
  balance: string | null;
  currency: string | null;
  convertedBalance?: number;
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

export function getColumns(
  t: ReturnType<typeof useTranslations<"accounts">>,
): ColumnDef<Account>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t("actions.selectAll")}
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t("actions.selectRow")}
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "icon",
      header: () => <div>{t("columns.icon")}</div>,
      cell: ({ row }) => {
        const Icon = accountTypeIcons[row.original.type];
        const colorClass = accountTypeColors[row.original.type];

        return (
          <div className={`inline-flex rounded-lg p-2 ${colorClass}`}>
            <Icon size={20} />
          </div>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.name")} />
      ),
      cell: ({ row }) => {
        return <span className="font-medium">{row.getValue("name")}</span>;
      },
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.type")} />
      ),
      cell: ({ row }) => {
        const type = row.getValue("type") as "checking" | "savings";
        return (
          <Badge variant="secondary" className={accountTypeColors[type]}>
            {t(`accountType.${type}`)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "balance",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.balance")} />
      ),
      cell: ({ row }) => {
        const balance = Number.parseFloat(row.getValue("balance") || "0");
        const currency = row.original.currency || "USD";
        return (
          <span className="font-medium">
            {formatCurrency(balance, currency)}
          </span>
        );
      },
      sortingFn: (rowA, rowB) => {
        const balanceA = Number.parseFloat(rowA.getValue("balance") || "0");
        const balanceB = Number.parseFloat(rowB.getValue("balance") || "0");
        return balanceA - balanceB;
      },
    },
    {
      accessorKey: "currency",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.currency")} />
      ),
      cell: ({ row }) => {
        const currency = row.getValue("currency") as string | null;
        return (
          <Badge variant="outline" className="font-mono">
            {currency || "USD"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">{t("columns.actions")}</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild={true}>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="sr-only">{t("actions.openMenu")}</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("columns.actions")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    // TODO: Implement edit account functionality
                    console.log("Edit account:", row.original.id);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  {t("actions.edit")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    // TODO: Implement delete account functionality
                    console.log("Delete account:", row.original.id);
                  }}
                  variant="destructive"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  {t("actions.delete")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}
