"use client";

import { DollarSignIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface AmountRange {
  min?: number;
  max?: number;
}

interface DataTableAmountRangeFilterProps {
  amountRange?: AmountRange;
  onAmountRangeChange?: (range: AmountRange | undefined) => void;
}

export function DataTableAmountRangeFilter({
  amountRange,
  onAmountRangeChange,
}: DataTableAmountRangeFilterProps) {
  const t = useTranslations("transactions");
  const minAmountId = React.useId();
  const maxAmountId = React.useId();
  const [localMin, setLocalMin] = React.useState<string>(
    amountRange?.min?.toString() || "",
  );
  const [localMax, setLocalMax] = React.useState<string>(
    amountRange?.max?.toString() || "",
  );

  const hasRange =
    amountRange?.min !== undefined || amountRange?.max !== undefined;

  const handleApply = () => {
    const min = localMin ? Number.parseFloat(localMin) : undefined;
    const max = localMax ? Number.parseFloat(localMax) : undefined;
    onAmountRangeChange?.(
      min !== undefined || max !== undefined ? { min, max } : undefined,
    );
  };

  const handleClear = () => {
    setLocalMin("");
    setLocalMax("");
    onAmountRangeChange?.(undefined);
  };

  return (
    <Popover>
      <PopoverTrigger asChild={true}>
        <Button
          variant="outline"
          size="sm"
          className={cn("h-8 border-dashed", hasRange && "border-solid")}
        >
          <DollarSignIcon className="mr-2 h-4 w-4" />
          {t("filters.amountRange")}
          {hasRange && (
            <span className="ml-2 text-muted-foreground">
              {amountRange?.min !== undefined && `$${amountRange.min}`}
              {amountRange?.min !== undefined &&
                amountRange?.max !== undefined &&
                " - "}
              {amountRange?.max !== undefined && `$${amountRange.max}`}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px]" align="start">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">
              {t("filters.amountRange")}
            </h4>
            <p className="text-muted-foreground text-sm">
              {t("filters.amountRangeDescription")}
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor={minAmountId}>{t("filters.minAmount")}</Label>
              <Input
                id={minAmountId}
                type="number"
                placeholder="0.00"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="col-span-2 h-8"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor={maxAmountId}>{t("filters.maxAmount")}</Label>
              <Input
                id={maxAmountId}
                type="number"
                placeholder="1000.00"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="col-span-2 h-8"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleApply} size="sm" className="flex-1">
              {t("filters.apply")}
            </Button>
            <Button
              onClick={handleClear}
              size="sm"
              variant="outline"
              className="flex-1"
            >
              {t("filters.clear")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
