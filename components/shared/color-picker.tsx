"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const DEFAULT_COLOR = "#6b7280";

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const hexInputId = React.useId();
  const colorInputId = React.useId();
  const [hexInput, setHexInput] = React.useState(value || DEFAULT_COLOR);
  const displayColor = value || DEFAULT_COLOR;

  const handleHexChange = (newHex: string) => {
    setHexInput(newHex);
    if (/^#[0-9A-Fa-f]{6}$/.test(newHex)) {
      onChange(newHex);
    }
  };

  const handleHexBlur = () => {
    if (!/^#[0-9A-Fa-f]{6}$/.test(hexInput)) {
      setHexInput(displayColor);
    }
  };

  React.useEffect(() => {
    setHexInput(value || DEFAULT_COLOR);
  }, [value]);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Popover>
        <PopoverTrigger asChild={true}>
          <Button
            type="button"
            variant="outline"
            className={cn("w-full justify-start text-left font-normal")}
          >
            <div
              className="mr-2 h-4 w-4 rounded border"
              style={{ backgroundColor: displayColor }}
            />
            <span className="font-mono">{displayColor.toUpperCase()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={hexInputId}>Hex Color</Label>
              <Input
                id={hexInputId}
                type="text"
                value={hexInput}
                onChange={(e) => handleHexChange(e.target.value)}
                onBlur={handleHexBlur}
                placeholder="#000000"
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={colorInputId}>Color Picker</Label>
              <input
                id={colorInputId}
                type="color"
                value={displayColor}
                onChange={(e) => {
                  onChange(e.target.value);
                  setHexInput(e.target.value);
                }}
                className="h-10 w-full cursor-pointer rounded border"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
