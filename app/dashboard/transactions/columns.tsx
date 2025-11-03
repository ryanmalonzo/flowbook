"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import type { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table/data-table-column-header";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  formatTransactionAmount,
  formatTransactionDate,
  getTransactionTypeColor,
} from "@/lib/utils";
import type { Transaction } from "./types";

export function getColumns(
  t: ReturnType<typeof useTranslations<"transactions">>,
): ColumnDef<Transaction>[] {
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
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => {
        const date = row.getValue("date") as Date;
        return (
          <div className="whitespace-nowrap">{formatTransactionDate(date)}</div>
        );
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center space-x-2">
            <span className="max-w-[300px] truncate font-medium">
              {row.getValue("description")}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100"
              onClick={() => {
                // TODO: Implement inline edit functionality
                console.log("Edit:", row.original.id);
              }}
            >
              <Pencil className="h-3 w-3" />
            </Button>
          </div>
        );
      },
    },
    {
      accessorKey: "categoryName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Category" />
      ),
      cell: ({ row }) => {
        const categoryName = row.original.categoryName;
        const categoryIcon = row.original.categoryIcon || "tag";
        const categoryColor = row.original.categoryColor || "#6b7280";

        if (!categoryName) {
          return (
            <span className="text-muted-foreground text-sm">
              {t("category.uncategorized")}
            </span>
          );
        }

        return (
          <Badge
            variant="secondary"
            className="gap-1"
            style={{
              backgroundColor: `${categoryColor}20`,
              color: categoryColor,
            }}
          >
            <DynamicIcon name={categoryIcon as IconName} size={12} />
            {categoryName}
          </Badge>
        );
      },
    },
    {
      accessorKey: "accountName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Account" />
      ),
      cell: ({ row }) => {
        return (
          <div className="whitespace-nowrap">{row.getValue("accountName")}</div>
        );
      },
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => {
        const type = row.getValue("type") as "income" | "expense" | "transfer";
        return (
          <Badge variant="secondary" className={getTransactionTypeColor(type)}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("amount"));
        const type = row.getValue("type") as "income" | "expense" | "transfer";

        const colorClass =
          type === "income"
            ? "text-green-600 dark:text-green-400"
            : type === "expense"
              ? "text-red-600 dark:text-red-400"
              : "text-blue-600 dark:text-blue-400";

        return (
          <div className={`whitespace-nowrap font-medium ${colorClass}`}>
            {formatTransactionAmount(amount, type, "USD")}
          </div>
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
                    // TODO: Implement edit transaction functionality
                    console.log("Edit transaction:", row.original.id);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  {t("actions.edit")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    // TODO: Implement delete transaction functionality
                    console.log("Delete transaction:", row.original.id);
                  }}
                  className="text-destructive"
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
