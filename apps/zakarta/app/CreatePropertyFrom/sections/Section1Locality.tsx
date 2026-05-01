import { MapPin } from "lucide-react";
import {
  FormControl,
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
import { AREAS } from "@repo/shared/schemas";
import type { UseFormReturn } from "react-hook-form";
import type { Locality } from "@/api";

import { SectionCard } from "../formComponents/SectionCard";
import type { FormValues, SectionStatus } from "../schema";

interface Section1LocalityProps {
  form: UseFormReturn<FormValues>;
  status: SectionStatus;
  onExpand: () => void;
  onSave: () => void;
  localityList: Locality[];
  loadingLocalities: boolean;
}

export function Section1Locality({
  form,
  status,
  onExpand,
  onSave,
  localityList,
  loadingLocalities,
}: Section1LocalityProps) {
  return (
    <SectionCard
      number={1}
      title="Locality"
      icon={<MapPin className="h-4 w-4 text-emerald-500" />}
      status={status}
      onExpand={onExpand}
      onSave={onSave}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Area / City */}
        <FormField
          control={form.control}
          name="area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Area / City</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select area" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {AREAS.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Locality */}
        <FormField
          control={form.control}
          name="localityId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Locality</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={loadingLocalities || localityList.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        loadingLocalities
                          ? "Loading…"
                          : localityList.length === 0
                            ? "Select area first"
                            : "Select locality"
                      }
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {localityList.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </SectionCard>
  );
}