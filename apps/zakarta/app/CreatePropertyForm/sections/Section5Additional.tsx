import { CheckCircle2 } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import { FormControl } from "@repo/ui/components/ui/form";
import { Separator } from "@repo/ui/components/ui/separator";
import { KHATA_VALUES, YES_NO_DK, AVAILABILITY_PERIODS } from "@repo/shared/schemas";
import type { UseFormReturn } from "react-hook-form";
import type { FormValues } from "../schema";
import { SectionCard } from "../formComponents/SectionCard";
import { ToggleButton } from "../formComponents/ToggleButton";

function label(val: string) {
  return val
    .replace(/_/g, " ")
    .replace(/</, "< ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    const ampm = h < 12 ? "AM" : "PM";
    const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    slots.push(`${hour12}:00 ${ampm}`);
    slots.push(`${hour12}:30 ${ampm}`);
  }
  return slots;
}
const TIME_SLOTS = generateTimeSlots();

interface Section5AdditionalProps {
  form: UseFormReturn<FormValues>;
  status: "pending" | "active" | "saved";
  onExpand: () => void;
  onSave: () => void;
  homeType: string;
}

export function Section5Additional({
  form,
  status,
  onExpand,
  onSave,
  homeType,
}: Section5AdditionalProps) {
  const isAptOrVilla =
    homeType === "apartment" || homeType === "gated_community_villa";

  return (
    <SectionCard
      number={5}
      title="Additional Info"
      icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
      status={status}
      onExpand={onExpand}
      onSave={onSave}
    >
      {/* Documents */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Khata Certificate */}
        <FormField
          control={form.control}
          name="khataCertificate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Khata Certificate</FormLabel>
              <div className="flex flex-wrap gap-2 pt-1">
                {KHATA_VALUES.map((k) => (
                  <ToggleButton
                    key={k}
                    active={field.value === k}
                    onClick={() => field.onChange(k)}
                  >
                    {label(k)}
                  </ToggleButton>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Allotment Letter — apartments/villas only */}
        {isAptOrVilla && (
          <FormField
            control={form.control}
            name="allotmentLetter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Allotment Letter</FormLabel>
                <div className="flex flex-wrap gap-2 pt-1">
                  {YES_NO_DK.map((v) => (
                    <ToggleButton
                      key={v}
                      active={field.value === v}
                      onClick={() => field.onChange(v)}
                    >
                      {label(v)}
                    </ToggleButton>
                  ))}
                </div>
              </FormItem>
            )}
          />
        )}

        {/* Sale Deed / Property Tax / Occupancy */}
        {(
          ["saleDeedCertificate", "paidPropertyTax", "occupancyCertificate"] as const
        ).map((fieldName) => (
          <FormField
            key={fieldName}
            control={form.control}
            name={fieldName}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{label(fieldName)}</FormLabel>
                <div className="flex flex-wrap gap-2 pt-1">
                  {YES_NO_DK.map((v) => (
                    <ToggleButton
                      key={v}
                      active={field.value === v}
                      onClick={() => field.onChange(v)}
                    >
                      {label(v)}
                    </ToggleButton>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>

      <Separator />

      {/* Availability */}
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="availabilityPeriod"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Availability Period</FormLabel>
              <div className="flex gap-2 pt-1">
                {AVAILABILITY_PERIODS.map((p) => (
                  <ToggleButton
                    key={p}
                    active={field.value === p}
                    onClick={() => field.onChange(p)}
                  >
                    {label(p)}
                  </ToggleButton>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="availabilityStartTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="From" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TIME_SLOTS.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="availabilityEndTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Until" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TIME_SLOTS.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </SectionCard>
  );
}