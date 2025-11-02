"use client";

import { CalendarIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DataTableDateRangeFilterProps {
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
}

export function DataTableDateRangeFilter({
  dateRange,
  onDateRangeChange,
}: DataTableDateRangeFilterProps) {
  const t = useTranslations("transactions");

  return (
    <Popover>
      <PopoverTrigger asChild={true}>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-8 border-dashed",
            dateRange?.from && "border-solid",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {t("filters.dateRange")}
          {dateRange?.from && (
            <span className="ml-2 text-muted-foreground">
              {dateRange.from.toLocaleDateString()} -{" "}
              {dateRange.to?.toLocaleDateString() || "..."}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus={true}
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={onDateRangeChange}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}

