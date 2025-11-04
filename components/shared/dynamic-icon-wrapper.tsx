"use client";

import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import type React from "react";

interface DynamicIconWrapperProps {
  name: IconName;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const SIZE_TO_TAILWIND: Record<number, string> = {
  12: "h-3 w-3",
  16: "h-4 w-4",
  20: "h-5 w-5",
  24: "h-6 w-6",
  32: "h-8 w-8",
  40: "h-10 w-10",
  48: "h-12 w-12",
};

export function DynamicIconWrapper({
  name,
  size = 24,
  className,
  style,
}: DynamicIconWrapperProps) {
  const wrapperClasses = SIZE_TO_TAILWIND[size] || `h-6 w-6`;

  return (
    <div className={`flex ${wrapperClasses} items-center justify-center`}>
      <DynamicIcon
        name={name}
        size={size}
        className={className}
        style={style}
      />
    </div>
  );
}
