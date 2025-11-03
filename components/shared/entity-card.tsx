"use client";

import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EntityCardProps {
  icon: LucideIcon;
  title: string;
  badge?: React.ReactNode;
  contentLabel?: string;
  contentValue?: string | number;
  contentFormatter?: (value: string | number) => string;
  className?: string;
  onClick?: () => void;
}

export function EntityCard({
  icon: Icon,
  title,
  badge,
  contentLabel,
  contentValue,
  contentFormatter,
  className,
  onClick,
}: EntityCardProps) {
  const formattedContentValue =
    contentValue !== undefined
      ? contentFormatter
        ? contentFormatter(contentValue)
        : String(contentValue)
      : null;

  return (
    <Card
      className={cn(
        "transition-shadow hover:shadow-md",
        onClick && "cursor-pointer",
        className,
      )}
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-muted p-2">
              <Icon className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
          {badge}
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
      </CardHeader>
      {contentLabel && formattedContentValue && (
        <CardContent>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">
              {contentLabel}
            </span>
            <span className="font-semibold text-2xl">
              {formattedContentValue}
            </span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
