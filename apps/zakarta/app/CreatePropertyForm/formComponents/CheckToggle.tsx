import type { ReactNode } from "react";
import { CheckCheck } from "lucide-react";

interface CheckToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  icon?: ReactNode;
}

export function CheckToggle({ checked, onChange, label, icon }: CheckToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm transition-all ${
        checked
          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
          : "border-input bg-background text-muted-foreground hover:border-emerald-300"
      }`}
    >
      {checked && <CheckCheck className="h-3.5 w-3.5" />}
      {icon}
      <span>{label}</span>
    </button>
  );
}