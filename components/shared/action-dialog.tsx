"use client";

import type { IconName } from "lucide-react/dynamic";
import type * as React from "react";

import { DynamicIconWrapper } from "@/components/shared/dynamic-icon-wrapper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  icon?: IconName;
  children: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
}

export function ActionDialog({
  open,
  onOpenChange,
  title,
  description,
  icon,
  children,
  primaryAction,
  secondaryAction,
}: ActionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          {icon && (
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <DynamicIconWrapper
                name={icon}
                size={24}
                className="text-primary"
              />
            </div>
          )}
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-4">{children}</div>
        {(primaryAction || secondaryAction) && (
          <DialogFooter>
            {secondaryAction}
            {primaryAction}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
