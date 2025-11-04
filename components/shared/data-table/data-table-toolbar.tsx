"use client";

import { X } from "lucide-react";
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
}

export function DataTableToolbar({
  children,
  onSearchChange,
  searchValue = "",
  onReset,
  showReset = false,
  translationNamespace,
  searchPlaceholder,
}: DataTableToolbarProps) {
  const t = useTranslations(translationNamespace);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
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
    </div>
  );
}
