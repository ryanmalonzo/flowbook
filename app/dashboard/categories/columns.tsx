"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
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

interface Category {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
}

export function getColumns(
  t: ReturnType<typeof useTranslations<"categories">>,
): ColumnDef<Category>[] {
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
        const iconName = row.original.icon || "tag";
        const color = row.original.color || "#6b7280";

        return (
          <div
            className="inline-flex rounded-lg p-2"
            style={{
              backgroundColor: `${color}20`,
            }}
          >
            <DynamicIcon
              name={iconName as IconName}
              size={20}
              style={{ color }}
            />
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
      accessorKey: "color",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("columns.color")} />
      ),
      cell: ({ row }) => {
        const color = row.getValue("color") as string | null;
        const displayColor = color || "#6b7280";

        return (
          <Badge
            variant="secondary"
            className="gap-2 font-mono"
            style={{
              backgroundColor: `${displayColor}20`,
              color: displayColor,
            }}
          >
            <div
              className="h-3 w-3 rounded-full border"
              style={{ backgroundColor: displayColor }}
            />
            {displayColor.toUpperCase()}
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
                    // TODO: Implement edit category functionality
                    console.log("Edit category:", row.original.id);
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  {t("actions.edit")}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    // TODO: Implement delete category functionality
                    console.log("Delete category:", row.original.id);
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
