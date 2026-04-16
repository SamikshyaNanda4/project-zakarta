import { IndianRupee, Phone } from "lucide-react";
import {
  FormControl,
  FormDescription,
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
import { Input } from "@repo/ui/components/ui/input";
import { Textarea } from "@repo/ui/components/ui/textarea";
import {
  FURNISHED_VALUES,
  PARKING_VALUES,
  KITCHEN_TYPES,
  PREFERRED_TENANTS,
} from "@repo/shared/schemas";
import type { UseFormReturn } from "react-hook-form";
import type { FormValues } from "../schema";
import { SectionCard } from "../formComponents/SectionCard";
import { ToggleButton } from "../formComponents/ToggleButton";
import { CheckToggle } from "../formComponents/CheckToggle";

function label(val: string) {
  return val
    .replace(/_/g, " ")
    .replace(/</, "< ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

interface Section3PricingProps {
  form: UseFormReturn<FormValues>;
  status: "pending" | "active" | "saved";
  onExpand: () => void;
  onSave: () => void;
  isSell: boolean;
  monthlyMaintenanceExtra: boolean | undefined;
}

export function Section3Pricing({
  form,
  status,
  onExpand,
  onSave,
  isSell,
  monthlyMaintenanceExtra,
}: Section3PricingProps) {
  return (
    <SectionCard
      number={3}
      title={isSell ? "Sale Details" : "Rent Details"}
      icon={<IndianRupee className="h-4 w-4 text-emerald-500" />}
      status={status}
      onExpand={onExpand}
      onSave={onSave}
    >
      {isSell ? (
        <>
          {/* Price + Maintenance */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="expectedPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Price (₹ Lakhs / Cr)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)}
                      type="number"
                      placeholder="45"
                      min={1}
                    />
                  </FormControl>
                  <FormDescription>e.g. 45 for ₹45 Lakhs, 1.2 for ₹1.2 Cr</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maintenanceCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Maintenance Cost (₹)
                    <span className="ml-1 text-xs text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)}
                      type="number"
                      placeholder="2000"
                      min={0}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Kitchen / Furnished / Parking */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="kitchenType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kitchen Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {KITCHEN_TYPES.map((k) => (
                        <SelectItem key={k} value={k}>{label(k)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="furnishedStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Furnished Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FURNISHED_VALUES.map((f) => (
                        <SelectItem key={f} value={f}>{label(f)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parking"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parking</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PARKING_VALUES.map((p) => (
                        <SelectItem key={p} value={p}>{label(p)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>
        </>
      ) : (
        <>
          {/* Rent + Deposit */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="expectedRent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Rent (₹/month)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)}
                      type="number"
                      placeholder="15000"
                      min={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expectedDeposit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Security Deposit (₹)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)}
                      type="number"
                      placeholder="30000"
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Monthly maintenance toggle */}
          <FormField
            control={form.control}
            name="monthlyMaintenanceExtra"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Maintenance Extra?</FormLabel>
                <div className="flex gap-2 pt-1">
                  {[true, false].map((v) => (
                    <ToggleButton
                      key={String(v)}
                      active={field.value === v}
                      onClick={() => field.onChange(v)}
                    >
                      {v ? "Yes" : "No"}
                    </ToggleButton>
                  ))}
                </div>
              </FormItem>
            )}
          />

          {monthlyMaintenanceExtra && (
            <FormField
              control={form.control}
              name="monthlyMaintenanceAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Maintenance Amount (₹)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)}
                      type="number"
                      placeholder="1500"
                      min={1}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Furnished + Parking */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="furnished"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Furnished Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FURNISHED_VALUES.map((f) => (
                        <SelectItem key={f} value={f}>{label(f)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parking"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parking</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PARKING_VALUES.map((p) => (
                        <SelectItem key={p} value={p}>{label(p)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </div>

          {/* Preferred Tenants */}
          <FormField
            control={form.control}
            name="preferredTenants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Tenants</FormLabel>
                <div className="flex flex-wrap gap-2 pt-1">
                  {PREFERRED_TENANTS.map((t) => (
                    <CheckToggle
                      key={t}
                      checked={field.value?.includes(t) ?? false}
                      onChange={(checked) => {
                        const current = field.value ?? [];
                        field.onChange(
                          checked ? [...current, t] : current.filter((x) => x !== t)
                        );
                      }}
                      label={label(t)}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}

      {/* Common: Available From + Contact */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="availableFrom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available From</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                Contact Number
              </FormLabel>
              <FormControl>
                <Input {...field} type="tel" placeholder="+91 98765 43210" maxLength={15} />
              </FormControl>
              <FormDescription>Hidden until a verified user requests it.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Description
              <span className="ml-1 text-xs text-muted-foreground">(optional)</span>
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Describe key features, nearby landmarks, special highlights…"
                maxLength={1000}
                rows={4}
                className="resize-none"
              />
            </FormControl>
            <FormDescription>{(field.value?.length ?? 0)} / 1000</FormDescription>
          </FormItem>
        )}
      />
    </SectionCard>
  );
}