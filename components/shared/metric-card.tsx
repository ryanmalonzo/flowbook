"use client";

import { Info, type LucideIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn, formatCurrency } from "@/lib/utils";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  currency?: string;
  valueColor?: "green" | "red" | "default";
  tooltip?: string;
  className?: string;
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  currency,
  valueColor = "default",
  tooltip,
  className,
}: MetricCardProps) {
  const formattedValue = currency
    ? formatCurrency(Number(value), currency)
    : value;

  const valueColorClasses = {
    green: "text-green-600 dark:text-green-400",
    red: "text-red-600 dark:text-red-400",
    default: "",
  };

  const iconColorClasses = {
    green: "text-green-600 dark:text-green-400",
    red: "text-red-600 dark:text-red-400",
    default: "",
  };

  return (
    <Card className={cn("border-2", className)}>
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <Icon
            className={cn(
              "h-4 w-4",
              iconColorClasses[valueColor] || iconColorClasses.default,
            )}
          />
          {label}
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild={true}>
                <Info className="h-4 w-4 cursor-help text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-wrap">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </CardDescription>
        <CardTitle
          className={cn(
            "font-bold text-4xl",
            valueColorClasses[valueColor] || valueColorClasses.default,
          )}
        >
          {formattedValue}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
