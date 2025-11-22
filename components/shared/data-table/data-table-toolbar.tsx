"use client";

import { Trash2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableToolbarProps {
  children?: React.ReactNode;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
  onReset?: () => void;
  showReset?: boolean;
  translationNamespace: Parameters<typeof useTranslations>[0];
  searchPlaceholder?: string;
  selectedCount?: number;
  onBulkDelete?: () => void;
}

export function DataTableToolbar({
  children,
  onSearchChange,
  searchValue = "",
  onReset,
  showReset = false,
  translationNamespace,
  searchPlaceholder,
  selectedCount = 0,
  onBulkDelete,
}: DataTableToolbarProps) {
  const t = useTranslations(translationNamespace);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder={searchPlaceholder || t("filters.search")}
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {children}
        {showReset && (
          <Button
            variant="ghost"
            onClick={onReset}
            className="h-8 px-2 lg:px-3"
          >
            {t("filters.reset")}
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      {selectedCount > 0 && onBulkDelete && (
        <div className="flex shrink-0 items-center gap-2">
          <span className="whitespace-nowrap text-muted-foreground text-sm">
            {selectedCount} {t("filters.selected")}
          </span>
          <Button
            variant="destructive"
            size="sm"
            onClick={onBulkDelete}
            className="h-8 shrink-0"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t("bulkActions.deleteSelected")}
          </Button>
        </div>
      )}
    </div>
  );
}
