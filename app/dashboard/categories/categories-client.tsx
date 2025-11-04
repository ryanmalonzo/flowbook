"use client";

import { DynamicIcon } from "lucide-react/dynamic";
import { useTranslations } from "next-intl";
import * as React from "react";
import { DataTable } from "@/components/shared/data-table/data-table";
import { DataTableToolbar } from "@/components/shared/data-table/data-table-toolbar";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getColumns } from "./columns";

interface Category {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
}

interface CategoriesClientProps {
  categories: Category[];
}

export default function CategoriesClient({
  categories,
}: CategoriesClientProps) {
  const t = useTranslations("categories");
  const [searchValue, setSearchValue] = React.useState("");

  const hasFilters = Boolean(searchValue);

  const handleReset = () => {
    setSearchValue("");
  };

  const filteredCategories = React.useMemo(() => {
    return categories.filter((category) => {
      if (
        searchValue &&
        !category.name.toLowerCase().includes(searchValue.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [categories, searchValue]);

  const columns = getColumns(t);

  const toolbar = (
    <DataTableToolbar
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      showReset={hasFilters}
      onReset={handleReset}
      translationNamespace="categories"
    />
  );

  return (
    <div className="space-y-4">
      {categories.length === 0 ? (
        <Card className="border-dashed">
          <CardHeader className="pt-12 pb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <DynamicIcon
                name="tag"
                className="h-8 w-8 text-muted-foreground"
              />
            </div>
            <CardTitle className="text-2xl">{t("empty.title")}</CardTitle>
            <CardDescription className="text-base">
              {t("empty.description")}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          {toolbar}
          <DataTable
            columns={columns}
            data={filteredCategories}
            translationNamespace="categories"
          />
        </>
      )}
    </div>
  );
}
