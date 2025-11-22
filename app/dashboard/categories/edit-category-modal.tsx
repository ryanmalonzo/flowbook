"use client";

import { useTranslations } from "next-intl";
import * as React from "react";
import { toast } from "sonner";

import { ActionDialog } from "@/components/shared/action-dialog";
import { ColorPicker } from "@/components/shared/color-picker";
import { IconPicker } from "@/components/shared/icon-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCategory } from "./actions";

interface Category {
  id: string;
  name: string;
  color: string | null;
  icon: string | null;
}

interface EditCategoryModalProps {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCategoryModal({
  category,
  open,
  onOpenChange,
}: EditCategoryModalProps) {
  const t = useTranslations("categories.edit");
  const categoryNameId = React.useId();
  const formId = React.useId();
  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState("#6b7280");
  const [icon, setIcon] = React.useState("tag");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (category) {
      setName(category.name);
      setColor(category.color || "#6b7280");
      setIcon(category.icon || "tag");
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateCategory({
        categoryId: category.id,
        name,
        color,
        icon,
      });

      if (result.success) {
        toast.success(t("success"));
        onOpenChange(false);
      } else {
        toast.error(result.error || t("error"));
      }
    } catch {
      toast.error(t("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title={t("title")}
      description={t("description")}
      icon="pencil"
      primaryAction={
        <Button
          type="submit"
          form={formId}
          disabled={isSubmitting || !name.trim()}
        >
          {t("save")}
        </Button>
      }
      secondaryAction={
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isSubmitting}
        >
          {t("cancel")}
        </Button>
      }
    >
      <form id={formId} onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={categoryNameId}>{t("name.label")}</Label>
          <Input
            id={categoryNameId}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("name.placeholder")}
            disabled={isSubmitting}
            required={true}
          />
        </div>

        <IconPicker value={icon} onChange={setIcon} label={t("icon.label")} />

        <ColorPicker
          value={color}
          onChange={setColor}
          label={t("color.label")}
        />
      </form>
    </ActionDialog>
  );
}
