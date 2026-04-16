import type { ReactNode } from "react";
import { CheckCircle2, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import { Separator } from "@repo/ui/components/ui/separator";
import type { SectionStatus } from "../schema";

interface SectionCardProps {
  number: number;
  title: string;
  icon: ReactNode;
  status: SectionStatus;
  onExpand: () => void;
  onSave: () => void;
  saving?: boolean;
  children: ReactNode;
}

export function SectionCard({
  number,
  title,
  icon,
  status,
  onExpand,
  onSave,
  saving,
  children,
}: SectionCardProps) {
  const isOpen = status === "active";

  return (
    <div
      className={`rounded-xl border transition-all ${
        status === "saved"
          ? "border-emerald-200 bg-emerald-50/50"
          : status === "active"
            ? "border-emerald-400 shadow-md"
            : "border-border bg-muted/30 opacity-60"
      }`}
    >
      {/* Header */}
      <button
        type="button"
        onClick={status !== "pending" ? onExpand : undefined}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
              status === "saved"
                ? "bg-emerald-500 text-white"
                : status === "active"
                  ? "bg-emerald-600 text-white"
                  : "bg-muted-foreground/30 text-muted-foreground"
            }`}
          >
            {status === "saved" ? <CheckCircle2 className="h-4 w-4" /> : number}
          </span>
          <span className="flex items-center gap-2 font-semibold text-sm">
            {icon}
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {status === "saved" && !isOpen && (
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-[10px]">
              Saved
            </Badge>
          )}
          {status !== "pending" &&
            (isOpen ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ))}
        </div>
      </button>

      {/* Body */}
      {isOpen && (
        <>
          <Separator />
          <div className="px-5 py-5 space-y-5">
            {children}
            <div className="flex justify-end pt-2">
              <Button
                type="button"
                onClick={onSave}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700 min-w-[130px]"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save & Continue"
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}