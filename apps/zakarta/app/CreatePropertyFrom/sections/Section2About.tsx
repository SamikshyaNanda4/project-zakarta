import { Building2 } from "lucide-react";
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
import { Input } from "@repo/ui/components/ui/input";
import {
  BHK_VALUES,
  PROPERTY_AGES,
  FACINGS,
  FLOOR_TYPES,
} from "@repo/shared/schemas";
import type { UseFormReturn } from "react-hook-form";

import { SectionCard } from "../formComponents/SectionCard";
import { ToggleButton } from "../formComponents/ToggleButton";
import { label, type FormValues, type SectionStatus } from "../schema";

interface Section2AboutProps {
  form: UseFormReturn<FormValues>;
  status: SectionStatus;
  onExpand: () => void;
  onSave: () => void;
  isSell: boolean;
  homeType: string;
}

export function Section2About({
  form,
  status,
  onExpand,
  onSave,
  isSell,
  homeType,
}: Section2AboutProps) {
  const HOME_TYPES_SELL = [
    "apartment",
    "independent_house",
    "gated_community_villa",
    "standalone_building",
  ];
  const HOME_TYPES_RENT = ["apartment", "independent_house", "gated_community_villa"];
  const homeTypes = isSell ? HOME_TYPES_SELL : HOME_TYPES_RENT;

  const isApartmentOrVilla =
    homeType === "apartment" || homeType === "gated_community_villa";

  return (
    <SectionCard
      number={2}
      title="About Property"
      icon={<Building2 className="h-4 w-4 text-emerald-500" />}
      status={status}
      onExpand={onExpand}
      onSave={onSave}
    >
      {/* Property Title */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Title</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder='e.g. "Spacious 2BHK in Patia near KIIT"'
                maxLength={120}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Home Type */}
      <FormField
        control={form.control}
        name="homeType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Home Type</FormLabel>
            <div className="flex flex-wrap gap-2">
              {homeTypes.map((t) => (
                <ToggleButton
                  key={t}
                  active={field.value === t}
                  onClick={() => field.onChange(t)}
                >
                  {label(t)}
                </ToggleButton>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Apartment / Society Name */}
      {isApartmentOrVilla && (
        <FormField
          control={form.control}
          name="apartmentName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {homeType === "apartment" ? "Apartment Name" : "Society Name"}
                <span className="ml-1 text-xs text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Prestige Garden" maxLength={100} />
              </FormControl>
            </FormItem>
          )}
        />
      )}

      {/* BHK / Property Age / Floor Type */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <FormField
          control={form.control}
          name="bhk"
          render={({ field }) => (
            <FormItem>
              <FormLabel>BHK Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {BHK_VALUES.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v} {v !== "1RK" ? "BHK" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="propertyAge"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Property Age</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PROPERTY_AGES.map((a) => (
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

        <FormField
          control={form.control}
          name="floorType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Floor Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {FLOOR_TYPES.map((f) => (
                    <SelectItem key={f} value={f}>
                      {label(f)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Sell-only: Built-up Area / Carpet Area / Ownership */}
      {isSell && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="builtUpArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Built-up Area (sqft)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)
                    }
                    type="number"
                    placeholder="1200"
                    min={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="carpetArea"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Carpet Area (sqft)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)
                    }
                    type="number"
                    placeholder="980"
                    min={1}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ownershipType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ownership</FormLabel>
                <div className="flex gap-2 pt-1">
                  {["self", "on_loan"].map((t) => (
                    <ToggleButton
                      key={t}
                      active={field.value === t}
                      onClick={() => field.onChange(t)}
                    >
                      {label(t)}
                    </ToggleButton>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      {/* Floor No / Total Floors / Facing */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {isApartmentOrVilla && (
          <FormField
            control={form.control}
            name="floorNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Floor No.</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) =>
                      field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)
                    }
                    type="number"
                    placeholder="3"
                    min={0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="totalFloors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Floors</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) =>
                    field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)
                  }
                  type="number"
                  placeholder="10"
                  min={1}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="facing"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facing</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select (optional)" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {FACINGS.map((f) => (
                    <SelectItem key={f} value={f}>
                      {label(f)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>

      {/* Rent-only: Available for Lease */}
      {!isSell && (
        <FormField
          control={form.control}
          name="availableForLease"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Available for Lease</FormLabel>
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
      )}
    </SectionCard>
  );
}