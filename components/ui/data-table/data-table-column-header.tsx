"use client";

import type { Column } from "@tanstack/react-table";
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
  sortField?: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  sortField,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  const handleSort = () => {
    if (!sortField) return;

    const params = new URLSearchParams(searchParams);
    const currentField = params.get("sortField");
    const currentDirection = params.get("sortDirection");

    if (currentField === sortField) {
      if (currentDirection === "asc") {
        params.set("sortDirection", "desc");
      } else if (currentDirection === "desc") {
        params.delete("sortField");
        params.delete("sortDirection");
      } else {
        params.set("sortDirection", "asc");
      }
    } else {
      params.set("sortField", sortField);
      params.set("sortDirection", "asc");
    }

    router.push(`?${params.toString()}`);
  };

  const currentField = searchParams.get("sortField");
  const currentDirection = searchParams.get("sortDirection");
  const isSorted =
    currentField === sortField
      ? currentDirection === "asc"
        ? "asc"
        : "desc"
      : false;

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent"
        onClick={handleSort}
      >
        <span>{title}</span>
        {isSorted === "desc" ? (
          <ArrowDownIcon className="ml-2 h-4 w-4" />
        ) : isSorted === "asc" ? (
          <ArrowUpIcon className="ml-2 h-4 w-4" />
        ) : (
          <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

