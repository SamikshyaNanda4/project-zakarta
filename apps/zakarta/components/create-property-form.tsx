"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Building2,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Home,
  IndianRupee,
  Loader2,
  MapPin,
  Phone,
  Tag,
  Camera,
  CheckCheck,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@repo/ui/components/ui/button";
import { Input } from "@repo/ui/components/ui/input";
import {
  Form,
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
import { Textarea } from "@repo/ui/components/ui/textarea";
import { Badge } from "@repo/ui/components/ui/badge";
import { Separator } from "@repo/ui/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@repo/ui/components/ui/card";

import { authClient } from "@/lib/auth-client";
import { properties, localities } from "@/api";
import type { Locality, CreateSellPropertyBody, CreateRentPropertyBody } from "@/api";
import {
  AREAS,
  BHK_VALUES,
  PROPERTY_AGES,
  FACINGS,
  FLOOR_TYPES,
  FURNISHED_VALUES,
  PARKING_VALUES,
  WHO_SHOWS,
  KITCHEN_TYPES,
  KHATA_VALUES,
  YES_NO_DK,
  AVAILABILITY_PERIODS,
  CURRENT_SELL_STATUS,
  WATER_SUPPLY,
  CURRENT_RENT_CONDITION,
  PREFERRED_TENANTS,
  POWER_BACKUP_VALUES,
} from "@repo/shared/schemas";

// ─────────────────────────────────────────────
// FULL FORM SCHEMA (flat, both sell + rent fields)
// ─────────────────────────────────────────────

const FormSchema = z.object({
  listingType: z.enum(["sell", "rent"]),
  // Section 1
  area: z.enum(["Bhubaneswar", "Cuttack", "Puri"]),
  localityId: z.string().min(1, "Please select a locality"),
  // Section 2
  title: z.string().min(5, "At least 5 characters").max(120),
  homeType: z.string().min(1, "Select property type"),
  apartmentName: z.string().optional(),
  bhk: z.string().min(1, "Select BHK"),
  ownershipType: z.string().optional(),
  builtUpArea: z.number().int().min(1, "Enter built-up area").optional(),
  carpetArea: z.number().int().min(1, "Enter carpet area").optional(),
  propertyAge: z.string().min(1, "Select property age"),
  facing: z.string().optional(),
  floorType: z.string().min(1, "Select floor type"),
  floorNumber: z.number().int().optional(),
  totalFloors: z.number().int().min(1, "Enter total floors"),
  availableForLease: z.boolean().optional(),
  // Section 3 — sell
  expectedPrice: z.number().optional(),
  availableFrom: z.string().min(1, "Select a date"),
  maintenanceCost: z.number().optional(),
  description: z.string().max(1000).optional(),
  kitchenType: z.string().optional(),
  furnishedStatus: z.string().optional(),
  parking: z.string().optional(),
  contact: z.string().min(10, "Enter valid contact").max(15),
  // Section 3 — rent
  expectedRent: z.number().optional(),
  expectedDeposit: z.number().optional(),
  monthlyMaintenanceExtra: z.boolean().optional(),
  monthlyMaintenanceAmount: z.number().optional(),
  preferredTenants: z.array(z.string()).optional(),
  furnished: z.string().optional(),
  // Section 4 — sell amenities
  bathrooms: z.number().int().min(1).optional(),
  kitchens: z.number().int().min(1).optional(),
  whoShows: z.string().min(1, "Select who will show"),
  currentStatus: z.string().optional(),
  gym: z.boolean().default(false),
  powerBackup: z.string().default("none"),
  gatedSociety: z.boolean().default(false),
  clubHouse: z.boolean().default(false),
  lift: z.boolean().default(false),
  intercom: z.boolean().default(false),
  shoppingCenter: z.boolean().default(false),
  sewageTreatment: z.boolean().default(false),
  gasPipeline: z.boolean().default(false),
  swimmingPool: z.boolean().default(false),
  fireSafety: z.boolean().default(false),
  childrenPlayArea: z.boolean().default(false),
  park: z.boolean().default(false),
  visitorParking: z.boolean().default(false),
  internetServices: z.boolean().default(false),
  // Section 4 — rent extras
  balcony: z.number().int().min(0).optional(),
  waterSupply: z.string().optional(),
  petAllowed: z.boolean().default(false),
  nonVegAllowed: z.boolean().default(false),
  gatedSecurity: z.boolean().default(false),
  currentCondition: z.string().optional(),
  directionDescription: z.string().max(1000).optional(),
  ac: z.boolean().default(false),
  rainwaterHarvesting: z.boolean().default(false),
  houseKeeping: z.boolean().default(false),
  washingMachine: z.boolean().default(false),
  laundry: z.boolean().default(false),
  // Section 5 — sell additional
  khataCertificate: z.string().optional(),
  allotmentLetter: z.string().optional(),
  saleDeedCertificate: z.string().optional(),
  paidPropertyTax: z.string().optional(),
  occupancyCertificate: z.string().optional(),
  availabilityPeriod: z.string().optional(),
  availabilityStartTime: z.string().optional(),
  availabilityEndTime: z.string().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// SMALL REUSABLE WIDGETS
// ─────────────────────────────────────────────

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
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

function CheckToggle({
  checked,
  onChange,
  label: lbl,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
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
      {lbl}
    </button>
  );
}

// ─────────────────────────────────────────────
// SECTION WRAPPER
// ─────────────────────────────────────────────

type SectionStatus = "pending" | "active" | "saved";

function SectionCard({
  number,
  title,
  icon,
  status,
  onExpand,
  children,
  onSave,
  saving,
}: {
  number: number;
  title: string;
  icon: React.ReactNode;
  status: SectionStatus;
  onExpand: () => void;
  children: React.ReactNode;
  onSave: () => void;
  saving?: boolean;
}) {
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
        {status !== "pending" &&
          (isOpen ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ))}
        {status === "saved" && !isOpen && (
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 ml-auto mr-2 text-[10px]">
            Saved
          </Badge>
        )}
      </button>

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

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export function CreatePropertyForm() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema) as Resolver<FormValues>,
    defaultValues: {
      listingType: "sell",
      area: "Bhubaneswar",
      localityId: "",
      title: "",
      homeType: "",
      bhk: "",
      ownershipType: "self",
      propertyAge: "",
      floorType: "",
      totalFloors: 1,
      availableForLease: true,
      availableFrom: "",
      contact: "",
      preferredTenants: [],
      monthlyMaintenanceExtra: false,
      whoShows: "",
      gym: false,
      powerBackup: "none",
      gatedSociety: false,
      clubHouse: false,
      lift: false,
      intercom: false,
      shoppingCenter: false,
      sewageTreatment: false,
      gasPipeline: false,
      swimmingPool: false,
      fireSafety: false,
      childrenPlayArea: false,
      park: false,
      visitorParking: false,
      internetServices: false,
      petAllowed: false,
      nonVegAllowed: false,
      gatedSecurity: false,
      ac: false,
      rainwaterHarvesting: false,
      houseKeeping: false,
      washingMachine: false,
      laundry: false,
    },
  });

  const listingType = form.watch("listingType");
  const area = form.watch("area");
  const homeType = form.watch("homeType");
  const monthlyMaintenanceExtra = form.watch("monthlyMaintenanceExtra");

  const [sectionStatus, setSectionStatus] = useState<SectionStatus[]>([
    "active", // 0: Locality
    "pending", // 1: About Property
    "pending", // 2: Sale/Rent Details
    "pending", // 3: Amenities
    "pending", // 4: Additional Info (sell) / Gallery (rent)
    "pending", // 5: Gallery
  ]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [localityList, setLocalityList] = useState<Locality[]>([]);
  const [loadingLocalities, setLoadingLocalities] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch localities when area changes
  useEffect(() => {
    if (!area) return;
    setLoadingLocalities(true);
    form.setValue("localityId", "");
    localities
      .list(area as "Bhubaneswar" | "Cuttack" | "Puri")
      .then((res) => setLocalityList(res.localities))
      .catch(() => toast.error("Failed to load localities"))
      .finally(() => setLoadingLocalities(false));
  }, [area, form]);

  // Redirect unauthenticated
  useEffect(() => {
    if (!isPending && !session?.user) router.replace("/");
  }, [isPending, session, router]);

  // When listing type changes, reset section status
  useEffect(() => {
    setSectionStatus(["active", "pending", "pending", "pending", "pending", "pending"]);
    setActiveIdx(0);
  }, [listingType]);

  const saveSection = useCallback(
    async (idx: number, fields: (keyof FormValues)[]) => {
      const valid = await form.trigger(fields);
      if (!valid) return;
      setSectionStatus((prev) => {
        const next = [...prev];
        next[idx] = "saved";
        if (idx + 1 < next.length) next[idx + 1] = "active";
        return next;
      });
      setActiveIdx(idx + 1);
    },
    [form]
  );

  const expandSection = useCallback((idx: number) => {
    setSectionStatus((prev) => {
      const next = [...prev];
      // close all active ones first
      for (let i = 0; i < next.length; i++) {
        if (next[i] === "active" && i !== idx) next[i] = "saved";
      }
      next[idx] = "active";
      return next;
    });
    setActiveIdx(idx);
  }, []);

  const isSell = listingType === "sell";

  // Determine which sections to show
  const totalSections = isSell ? 6 : 5;

  // Section field maps for validation
  const section1Fields: (keyof FormValues)[] = ["area", "localityId"];
  const section2Fields: (keyof FormValues)[] = [
    "title",
    "homeType",
    "bhk",
    "propertyAge",
    "floorType",
    "totalFloors",
    ...(isSell ? (["builtUpArea", "carpetArea", "ownershipType"] as (keyof FormValues)[]) : []),
  ];
  const section3FieldsSell: (keyof FormValues)[] = ["expectedPrice", "availableFrom", "contact"];
  const section3FieldsRent: (keyof FormValues)[] = [
    "expectedRent",
    "expectedDeposit",
    "availableFrom",
    "furnished",
    "contact",
    "preferredTenants",
  ];
  const section4Fields: (keyof FormValues)[] = ["bathrooms", "whoShows"];
  const section5Fields: (keyof FormValues)[] = isSell
    ? ["khataCertificate", "saleDeedCertificate", "paidPropertyTax", "occupancyCertificate", "availabilityPeriod", "availabilityStartTime", "availabilityEndTime"]
    : [];

  async function onSubmit() {
    // Validate entire form before submit
    const valid = await form.trigger();
    if (!valid) {
      const errors = form.formState.errors;
      const firstError = Object.values(errors)[0];
      const msg = firstError && "message" in firstError && firstError.message
        ? String(firstError.message)
        : "Please complete all required sections.";
      toast.error(msg);
      return;
    }

    const values = form.getValues();
    setIsSubmitting(true);

    try {
      if (isSell) {
        const body: CreateSellPropertyBody = {
          listingType: "sell",
          title: values.title,
          contact: values.contact,
          localityId: values.localityId,
          homeType: values.homeType as CreateSellPropertyBody["homeType"],
          apartmentName: values.apartmentName,
          bhk: values.bhk as CreateSellPropertyBody["bhk"],
          ownershipType: (values.ownershipType ?? "self") as "self" | "on_loan",
          builtUpArea: values.builtUpArea ?? 0,
          carpetArea: values.carpetArea ?? 0,
          propertyAge: values.propertyAge as CreateSellPropertyBody["propertyAge"],
          facing: values.facing,
          floorType: values.floorType,
          floorNumber: values.floorNumber,
          totalFloors: values.totalFloors,
          expectedPrice: values.expectedPrice ?? 0,
          availableFrom: values.availableFrom,
          maintenanceCost: values.maintenanceCost,
          description: values.description,
          kitchenType: values.kitchenType as CreateSellPropertyBody["kitchenType"],
          furnishedStatus: values.furnishedStatus as CreateSellPropertyBody["furnishedStatus"],
          parking: values.parking as CreateSellPropertyBody["parking"],
          bathrooms: values.bathrooms ?? 1,
          kitchens: values.kitchens ?? 1,
          whoShows: values.whoShows as CreateSellPropertyBody["whoShows"],
          currentStatus: values.currentStatus as CreateSellPropertyBody["currentStatus"],
          amenities: {
            gym: values.gym,
            powerBackup: values.powerBackup as "full" | "partial" | "none",
            gatedSociety: values.gatedSociety,
            clubHouse: values.clubHouse,
            lift: values.lift,
            intercom: values.intercom,
            shoppingCenter: values.shoppingCenter,
            sewageTreatment: values.sewageTreatment,
            gasPipeline: values.gasPipeline,
            swimmingPool: values.swimmingPool,
            fireSafety: values.fireSafety,
            childrenPlayArea: values.childrenPlayArea,
            park: values.park,
            visitorParking: values.visitorParking,
            internetServices: values.internetServices,
          },
          khataCertificate: values.khataCertificate as CreateSellPropertyBody["khataCertificate"],
          allotmentLetter: values.allotmentLetter as CreateSellPropertyBody["allotmentLetter"],
          saleDeedCertificate: values.saleDeedCertificate as CreateSellPropertyBody["saleDeedCertificate"],
          paidPropertyTax: values.paidPropertyTax as CreateSellPropertyBody["paidPropertyTax"],
          occupancyCertificate: values.occupancyCertificate as CreateSellPropertyBody["occupancyCertificate"],
          availabilityPeriod: values.availabilityPeriod as CreateSellPropertyBody["availabilityPeriod"],
          availabilityStartTime: values.availabilityStartTime,
          availabilityEndTime: values.availabilityEndTime,
        };
        await properties.create(body);
      } else {
        const body: CreateRentPropertyBody = {
          listingType: "rent",
          title: values.title,
          contact: values.contact,
          localityId: values.localityId,
          homeType: values.homeType as CreateRentPropertyBody["homeType"],
          bhk: values.bhk as CreateRentPropertyBody["bhk"],
          floorNumber: values.floorNumber,
          totalFloors: values.totalFloors,
          propertyAge: values.propertyAge,
          facing: values.facing,
          floorType: values.floorType,
          availableForLease: values.availableForLease ?? true,
          expectedRent: values.expectedRent ?? 0,
          expectedDeposit: values.expectedDeposit ?? 0,
          monthlyMaintenanceExtra: values.monthlyMaintenanceExtra ?? false,
          monthlyMaintenanceAmount: values.monthlyMaintenanceAmount,
          availableFrom: values.availableFrom,
          preferredTenants: values.preferredTenants ?? [],
          furnished: values.furnished ?? "unfurnished",
          parking: values.parking as CreateRentPropertyBody["parking"],
          description: values.description,
          bathrooms: values.bathrooms ?? 1,
          balcony: values.balcony ?? 0,
          waterSupply: values.waterSupply as CreateRentPropertyBody["waterSupply"],
          petAllowed: values.petAllowed,
          gym: values.gym,
          nonVegAllowed: values.nonVegAllowed,
          gatedSecurity: values.gatedSecurity,
          whoShows: values.whoShows as CreateRentPropertyBody["whoShows"],
          currentCondition: values.currentCondition as CreateRentPropertyBody["currentCondition"],
          directionDescription: values.directionDescription,
          amenities: {
            lift: values.lift,
            ac: values.ac,
            intercom: values.intercom,
            childrenPlayArea: values.childrenPlayArea,
            gasPipeline: values.gasPipeline,
            rainwaterHarvesting: values.rainwaterHarvesting,
            houseKeeping: values.houseKeeping,
            visitorParking: values.visitorParking,
            internetServices: values.internetServices,
            clubHouse: values.clubHouse,
            swimmingPool: values.swimmingPool,
            fireSafety: values.fireSafety,
            shoppingCenter: values.shoppingCenter,
            park: values.park,
            sewageTreatment: values.sewageTreatment,
            powerBackup: values.powerBackup === "full" || values.powerBackup === "partial",
            washingMachine: values.washingMachine,
            laundry: values.laundry,
          },
        };
        await properties.create(body);
      }

      toast.success("Property listed successfully!");
      setIsSuccess(true);
    } catch (err: unknown) {
      const apiErr = err as { response?: { status?: number; data?: { error?: string } } };
      if (apiErr.response?.status === 401) {
        toast.error("Authentication required");
        return;
      }
      if (apiErr.response?.status === 403) {
        toast.error("Permission denied", {
          description: "Your account is not permitted to post listings.",
        });
        return;
      }
      const msg = apiErr.response?.data?.error ?? "Something went wrong. Please try again.";
      toast.error("Failed to post listing", { description: msg });
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (isPending) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
      </div>
    );
  }

  // ── Success ──────────────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <Card className="border-emerald-200 bg-emerald-50 shadow-md">
        <CardContent className="flex flex-col items-center py-14 text-center">
          <CheckCircle2 className="mb-4 h-16 w-16 text-emerald-500" />
          <h2 className="text-2xl font-bold text-emerald-800">Property Listed!</h2>
          <p className="mt-2 max-w-sm text-sm text-emerald-700">
            Your listing is live. Interested buyers/renters will request your contact.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
              onClick={() => {
                form.reset();
                setIsSuccess(false);
                setSectionStatus(["active", "pending", "pending", "pending", "pending", "pending"]);
                setActiveIdx(0);
              }}
            >
              Post another listing
            </Button>
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => router.push("/")}
            >
              Browse listings
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Listing type picker */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-5 w-5 text-emerald-600" />
            Post Your Property
          </CardTitle>
          <CardDescription>
            Fill each section and save it. Post your property when all sections are complete.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {(["sell", "rent"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => form.setValue("listingType", type)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
                  listingType === type
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm"
                    : "border-input bg-background text-muted-foreground hover:border-emerald-200"
                }`}
              >
                {type === "sell" ? (
                  <>
                    <Home className="h-4 w-4" />
                    For Sale
                  </>
                ) : (
                  <>
                    <IndianRupee className="h-4 w-4" />
                    For Rent
                  </>
                )}
                {listingType === type && (
                  <Badge className="ml-1 bg-emerald-600 text-[10px] h-4 px-1.5">Active</Badge>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form noValidate className="space-y-3">

          {/* ── SECTION 1: Locality ─────────────────────────────────────────── */}
          <SectionCard
            number={1}
            title="Locality"
            icon={<MapPin className="h-4 w-4 text-emerald-500" />}
            status={sectionStatus[0]!}
            onExpand={() => expandSection(0)}
            onSave={() => saveSection(0, section1Fields)}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                          <SelectItem key={a} value={a}>{a}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

          {/* ── SECTION 2: About Property ───────────────────────────────────── */}
          <SectionCard
            number={2}
            title="About Property"
            icon={<Building2 className="h-4 w-4 text-emerald-500" />}
            status={sectionStatus[1]!}
            onExpand={() => expandSection(1)}
            onSave={() => saveSection(1, section2Fields)}
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='e.g. "Spacious 2BHK in Patia near KIIT"' maxLength={120} />
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
                    {(isSell
                      ? ["apartment", "independent_house", "gated_community_villa", "standalone_building"]
                      : ["apartment", "independent_house", "gated_community_villa"]
                    ).map((t) => (
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

            {/* Apartment/Gated Name */}
            {(homeType === "apartment" || homeType === "gated_community_villa") && (
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

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {/* BHK */}
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
                          <SelectItem key={v} value={v}>{v} {v !== "1RK" ? "BHK" : ""}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Property Age */}
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
                          <SelectItem key={a} value={a}>{a}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Floor Type */}
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
                          <SelectItem key={f} value={f}>{label(f)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Sell-specific: built-up area, carpet area, ownership */}
            {isSell && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormField
                  control={form.control}
                  name="builtUpArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Built-up Area (sqft)</FormLabel>
                      <FormControl>
                        <Input {...field} onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)} type="number" placeholder="1200" min={1} />
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
                        <Input {...field} onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)} type="number" placeholder="980" min={1} />
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

            {/* Floors */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {(homeType === "apartment" || homeType === "gated_community_villa") && (
                <FormField
                  control={form.control}
                  name="floorNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Floor No.</FormLabel>
                      <FormControl>
                        <Input {...field} onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)} type="number" placeholder="3" min={0} />
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
                      <Input {...field} onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)} type="number" placeholder="10" min={1} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Facing */}
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
                          <SelectItem key={f} value={f}>{label(f)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {/* Rent: available for lease */}
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

          {/* ── SECTION 3: Sale/Rent Details ────────────────────────────────── */}
          <SectionCard
            number={3}
            title={isSell ? "Sale Details" : "Rent Details"}
            icon={<IndianRupee className="h-4 w-4 text-emerald-500" />}
            status={sectionStatus[2]!}
            onExpand={() => expandSection(2)}
            onSave={() =>
              saveSection(2, isSell ? section3FieldsSell : section3FieldsRent)
            }
          >
            {isSell ? (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="expectedPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Price (₹ Lakhs / Cr)</FormLabel>
                        <FormControl>
                          <Input {...field} onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)} type="number" placeholder="45" min={1} />
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
                          <Input {...field} onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)} type="number" placeholder="2000" min={0} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="expectedRent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Rent (₹/month)</FormLabel>
                        <FormControl>
                          <Input {...field} onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)} type="number" placeholder="15000" min={1} />
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
                          <Input {...field} onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)} type="number" placeholder="30000" min={0} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Monthly maintenance */}
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
                          <Input {...field} onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)} type="number" placeholder="1500" min={1} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

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

            {/* Common: Available From + Description + Contact */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="availableFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available From</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" min={new Date().toISOString().split("T")[0]} />
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

          {/* ── SECTION 4: Amenities ────────────────────────────────────────── */}
          <SectionCard
            number={4}
            title="Amenities"
            icon={<Tag className="h-4 w-4 text-emerald-500" />}
            status={sectionStatus[3]!}
            onExpand={() => expandSection(3)}
            onSave={() => saveSection(3, section4Fields)}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <Input {...field} onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)} type="number" placeholder="2" min={1} max={10000} />
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
                        <Input {...field} onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)} type="number" placeholder="1" min={1} max={10000} />
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
                        <Input {...field} onChange={(e) => field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)} type="number" placeholder="1" min={0} max={10000} />
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

            {/* Current Status */}
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

            {/* Sell: Power Backup special case */}
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
              <p className="mb-3 text-sm font-medium text-muted-foreground">Select available amenities:</p>
              <div className="flex flex-wrap gap-2">
                {(isSell
                  ? ([
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
                    ] as [keyof FormValues, string][])
                  : ([
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
                    ] as [keyof FormValues, string][])
                ).map(([key, lbl]) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key}
                    render={({ field }) => (
                      <CheckToggle
                        checked={!!field.value}
                        onChange={field.onChange}
                        label={lbl}
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

          {/* ── SECTION 5: Additional Info (Sell only) / Gallery (Rent) ────── */}
          {isSell ? (
            <SectionCard
              number={5}
              title="Additional Info"
              icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              status={sectionStatus[4]!}
              onExpand={() => expandSection(4)}
              onSave={() => saveSection(4, section5Fields)}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

                {(homeType === "apartment" || homeType === "gated_community_villa") && (
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

                {(["saleDeedCertificate", "paidPropertyTax", "occupancyCertificate"] as const).map(
                  (fieldName) => (
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
                  )
                )}
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
          ) : null}

          {/* ── SECTION 5 (rent) / 6 (sell): Gallery ───────────────────────── */}
          <SectionCard
            number={isSell ? 6 : 5}
            title="Gallery"
            icon={<Camera className="h-4 w-4 text-emerald-500" />}
            status={sectionStatus[isSell ? 5 : 4]!}
            onExpand={() => expandSection(isSell ? 5 : 4)}
            onSave={() => {
              // Gallery is optional — just mark saved
              setSectionStatus((prev) => {
                const next = [...prev];
                const idx = isSell ? 5 : 4;
                next[idx] = "saved";
                return next;
              });
              setActiveIdx(isSell ? 6 : 5);
            }}
          >
            <div className="rounded-lg border-2 border-dashed border-muted-foreground/30 p-8 text-center">
              <Camera className="mx-auto mb-3 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm font-medium text-muted-foreground">
                Photo upload coming soon
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Up to {isSell ? 6 : 5} photos · At least 1 required at launch
              </p>
              <p className="mt-2 text-xs text-muted-foreground/60">
                Photos will be stored securely. Integration with R2 storage is in progress.
              </p>
            </div>
          </SectionCard>

          {/* ── Final Submit ─────────────────────────────────────────────────── */}
          <div className="pt-2">
            <Button
              type="button"
              onClick={onSubmit}
              disabled={isSubmitting}
              size="lg"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-base font-semibold py-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Posting your property…
                </>
              ) : (
                <>
                  <Home className="h-5 w-5" />
                  Post Your Property
                </>
              )}
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Your contact stays hidden until a verified user requests it.
            </p>
          </div>

        </form>
      </Form>
    </div>
  );
}
