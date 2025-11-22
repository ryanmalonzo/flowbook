"use client";

import type { IconName } from "lucide-react/dynamic";

import { DynamicIconWrapper } from "@/components/shared/dynamic-icon-wrapper";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const PRESET_ICONS: IconName[] = [
  "tag",
  "shopping-cart",
  "utensils",
  "coffee",
  "car",
  "bus",
  "plane",
  "home",
  "zap",
  "wifi",
  "smartphone",
  "laptop",
  "tv",
  "gamepad",
  "shirt",
  "heart",
  "music",
  "book",
  "briefcase",
  "dollar-sign",
  "credit-card",
  "gift",
  "party-popper",
  "dumbbell",
  "pill",
  "dog",
  "cat",
  "leaf",
  "sprout",
  "wrench",
];

interface IconPickerProps {
  value?: string;
  onChange: (icon: string) => void;
  label?: string;
}

export function IconPicker({ value, onChange, label }: IconPickerProps) {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="grid grid-cols-6 gap-2">
        {PRESET_ICONS.map((iconName) => {
          const isSelected = value === iconName;
          return (
            <button
              key={iconName}
              type="button"
              onClick={() => onChange(iconName)}
              className={cn(
                "flex items-center justify-center rounded-lg p-3 transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isSelected &&
                  "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
              aria-label={iconName}
            >
              <DynamicIconWrapper name={iconName} size={20} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
