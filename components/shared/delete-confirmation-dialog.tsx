"use client";

import { useTranslations } from "next-intl";

import { ActionDialog } from "@/components/shared/action-dialog";
import { Button } from "@/components/ui/button";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  itemName?: string;
  itemCount?: number;
  onConfirm: () => void | Promise<void>;
  isDeleting: boolean;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  itemName,
  itemCount,
  onConfirm,
  isDeleting,
}: DeleteConfirmationDialogProps) {
  const _t = useTranslations();

  const handleConfirm = async () => {
    await onConfirm();
  };

  const isBulkDelete = itemCount !== undefined && itemCount > 1;

  return (
    <ActionDialog
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
      icon="trash-2"
      primaryAction={
        <Button
          variant="destructive"
          onClick={handleConfirm}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      }
      secondaryAction={
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isDeleting}
        >
          Cancel
        </Button>
      }
    >
      {isBulkDelete ? (
        <div className="rounded-md bg-muted p-3">
          <p className="font-medium text-sm">
            {itemCount} {itemCount === 1 ? "item" : "items"} selected
          </p>
        </div>
      ) : (
        itemName && (
          <div className="rounded-md bg-muted p-3">
            <p className="font-medium text-sm">{itemName}</p>
          </div>
        )
      )}
    </ActionDialog>
  );
}
