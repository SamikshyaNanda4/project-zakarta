import type { ReactNode } from "react";

interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

export function ToggleButton({ active, onClick, children }: ToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
        active
          ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
          : "border-input bg-background text-muted-foreground hover:border-emerald-300"
      }`}
    >
      {children}
    </button>
  );
}