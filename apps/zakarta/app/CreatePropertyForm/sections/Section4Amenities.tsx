import { Tag } from "lucide-react";
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
  WHO_SHOWS,
  CURRENT_SELL_STATUS,
  WATER_SUPPLY,
  CURRENT_RENT_CONDITION,
  POWER_BACKUP_VALUES,
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

const amenityIcon = (src: string) => (
  <img src={src} className="h-4 w-4" alt="" aria-hidden="true" />
);

const amenityIcons: Record<string, React.ReactNode> = {
  gym: amenityIcon("/icons/gym.svg"),
  lift: amenityIcon("/icons/lift.svg"),
  intercom: amenityIcon("/icons/intercom.svg"),
  clubHouse: amenityIcon("/icons/club.svg"),
  swimmingPool: amenityIcon("/icons/pool.svg"),
  fireSafety: amenityIcon("/icons/fire.svg"),
  shoppingCenter: amenityIcon("/icons/shoppingcenter.svg"),
  park: amenityIcon("/icons/park.svg"),
  sewageTreatment: amenityIcon("/icons/sewage.svg"),
  gasPipeline: amenityIcon("/icons/gas.svg"),
  childrenPlayArea: amenityIcon("/icons/playarea.svg"),
  visitorParking: amenityIcon("/icons/parking.svg"),
  internetServices: amenityIcon("/icons/internet.svg"),
  gatedSociety: amenityIcon("/icons/gated.svg"),
  petAllowed: amenityIcon("/icons/pet.svg"),
  nonVegAllowed: amenityIcon("/icons/meat.svg"),
  gatedSecurity: amenityIcon("/icons/gated.svg"),
  ac: amenityIcon("/icons/ac.svg"),
  rainwaterHarvesting: amenityIcon("/icons/rainwater.svg"),
  houseKeeping: amenityIcon("/icons/housekeeping.svg"),
  washingMachine: amenityIcon("/icons/washingmachine.svg"),
  laundry: amenityIcon("/icons/laundry.svg"),
};

const SELL_AMENITIES: [keyof FormValues, string][] = [
  ["gym", "Gym"],
  ["gatedSociety", "Gated Society"],
  ["clubHouse", "Club House"],
  ["lift", "Lift"],
  ["intercom", "Intercom"],
  ["shoppingCenter", "Shopping Center"],
  ["sewageTreatment", "Sewage Treatment"],
  ["gasPipeline", "Gas Pipeline"],
  ["swimmingPool", "Swimming Pool"],
  ["fireSafety", "Fire Safety"],
  ["childrenPlayArea", "Children Play Area"],
  ["park", "Park"],
  ["visitorParking", "Visitor Parking"],
  ["internetServices", "Internet Services"],
];

const RENT_AMENITIES: [keyof FormValues, string][] = [
  ["gym", "Gym"],
  ["petAllowed", "Pet Allowed"],
  ["nonVegAllowed", "Non-Veg Allowed"],
  ["gatedSecurity", "Gated Security"],
  ["lift", "Lift"],
  ["ac", "AC"],
  ["intercom", "Intercom"],
  ["childrenPlayArea", "Children Play Area"],
  ["gasPipeline", "Gas Pipeline"],
  ["rainwaterHarvesting", "Rainwater Harvesting"],
  ["houseKeeping", "Housekeeping"],
  ["visitorParking", "Visitor Parking"],
  ["internetServices", "Internet Services"],
  ["clubHouse", "Club House"],
  ["swimmingPool", "Swimming Pool"],
  ["fireSafety", "Fire Safety"],
  ["shoppingCenter", "Shopping Center"],
  ["park", "Park"],
  ["sewageTreatment", "Sewage Treatment"],
  ["washingMachine", "Washing Machine"],
  ["laundry", "Laundry"],
];

interface Section4AmenitiesProps {
  form: UseFormReturn<FormValues>;
  status: "pending" | "active" | "saved";
  onExpand: () => void;
  onSave: () => void;
  isSell: boolean;
}

export function Section4Amenities({
  form,
  status,
  onExpand,
  onSave,
  isSell,
}: Section4AmenitiesProps) {
  return (
    <SectionCard
      number={4}
      title="Amenities"
      icon={<Tag className="h-4 w-4 text-emerald-500" />}
      status={status}
      onExpand={onExpand}
      onSave={onSave}
    >
      {/* Bathrooms / Kitchens or Balconies / Who Shows */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <FormField
          control={form.control}
          name="bathrooms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bathrooms</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)}
                  type="number"
                  placeholder="2"
                  min={1}
                  max={10000}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isSell ? (
          <FormField
            control={form.control}
            name="kitchens"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kitchens</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)}
                    type="number"
                    placeholder="1"
                    min={1}
                    max={10000}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="balcony"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Balconies</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)}
                    type="number"
                    placeholder="1"
                    min={0}
                    max={10000}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="whoShows"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Who Will Show</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {WHO_SHOWS.map((w) => (
                    <SelectItem key={w} value={w}>{label(w)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Current Status / Condition */}
      {isSell ? (
        <FormField
          control={form.control}
          name="currentStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Property Status</FormLabel>
              <div className="flex flex-wrap gap-2 pt-1">
                {CURRENT_SELL_STATUS.map((s) => (
                  <ToggleButton
                    key={s}
                    active={field.value === s}
                    onClick={() => field.onChange(s)}
                  >
                    {label(s)}
                  </ToggleButton>
                ))}
              </div>
            </FormItem>
          )}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="currentCondition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Current Property Condition</FormLabel>
                <div className="flex flex-wrap gap-2 pt-1">
                  {CURRENT_RENT_CONDITION.map((s) => (
                    <ToggleButton
                      key={s}
                      active={field.value === s}
                      onClick={() => field.onChange(s)}
                    >
                      {label(s)}
                    </ToggleButton>
                  ))}
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="waterSupply"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Water Supply</FormLabel>
                <div className="flex flex-wrap gap-2 pt-1">
                  {WATER_SUPPLY.map((w) => (
                    <ToggleButton
                      key={w}
                      active={field.value === w}
                      onClick={() => field.onChange(w)}
                    >
                      {label(w)}
                    </ToggleButton>
                  ))}
                </div>
              </FormItem>
            )}
          />
        </div>
      )}

      {/* Power Backup (sell only) */}
      {isSell && (
        <FormField
          control={form.control}
          name="powerBackup"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Power Backup</FormLabel>
              <div className="flex gap-2 pt-1">
                {POWER_BACKUP_VALUES.map((p) => (
                  <ToggleButton
                    key={p}
                    active={field.value === p}
                    onClick={() => field.onChange(p)}
                  >
                    {label(p)}
                  </ToggleButton>
                ))}
              </div>
            </FormItem>
          )}
        />
      )}

      {/* Boolean amenities grid */}
      <div>
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          Select available amenities:
        </p>
        <div className="flex flex-wrap gap-2">
          {(isSell ? SELL_AMENITIES : RENT_AMENITIES).map(([key, lbl]) => (
            <FormField
              key={key}
              control={form.control}
              name={key}
              render={({ field }) => (
                <CheckToggle
                  checked={!!field.value}
                  onChange={field.onChange}
                  label={lbl}
                  icon={amenityIcons[key]}
                />
              )}
            />
          ))}
        </div>
      </div>

      {/* Rent: direction description */}
      {!isSell && (
        <FormField
          control={form.control}
          name="directionDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Directions / Landmark
                <span className="ml-1 text-xs text-muted-foreground">(optional)</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Near XYZ signal, 2 min from ABC road…"
                  maxLength={1000}
                  rows={3}
                  className="resize-none"
                />
              </FormControl>
              <FormDescription>{(field.value?.length ?? 0)} / 1000</FormDescription>
            </FormItem>
          )}
        />
      )}
    </SectionCard>
  );
}