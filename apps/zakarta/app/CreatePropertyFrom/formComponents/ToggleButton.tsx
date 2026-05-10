import { CheckCheck } from "lucide-react";

// ─────────────────────────────────────────────
// TOGGLE BUTTON — single-select pill
// ─────────────────────────────────────────────

interface ToggleButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
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

// ─────────────────────────────────────────────
// CHECK TOGGLE — multi-select boolean pill
// ─────────────────────────────────────────────

interface CheckToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

export function CheckToggle({ checked, onChange, label }: CheckToggleProps) {
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
      {label}
    </button>
  );
}