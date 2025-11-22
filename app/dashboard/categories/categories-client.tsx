"use client";

import { useTranslations } from "next-intl";
import * as React from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/shared/data-table/data-table";
import { DataTableToolbar } from "@/components/shared/data-table/data-table-toolbar";
import { DeleteConfirmationDialog } from "@/components/shared/delete-confirmation-dialog";
import { DynamicIconWrapper } from "@/components/shared/dynamic-icon-wrapper";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { deleteCategory } from "./actions";
import { getColumns } from "./columns";
import { EditCategoryModal } from "./edit-category-modal";

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
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [deletingCategory, setDeletingCategory] =
    React.useState<Category | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

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

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDelete = (category: Category) => {
    setDeletingCategory(category);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) {
      return;
    }

    setIsDeleting(true);
    const result = await deleteCategory(deletingCategory.id);
    setIsDeleting(false);

    if (result.success) {
      toast.success(t("delete.success"));
      setIsDeleteModalOpen(false);
      setDeletingCategory(null);
    } else {
      toast.error(result.error || t("delete.error"));
    }
  };

  const columns = getColumns(t, handleEdit, handleDelete);

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
              <DynamicIconWrapper
                name="tag"
                size={32}
                className="text-muted-foreground"
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
      <EditCategoryModal
        category={editingCategory}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
      />
      <DeleteConfirmationDialog
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        title={t("delete.title")}
        description={t("delete.description")}
        itemName={deletingCategory?.name || ""}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
