import { z } from "zod";

export const FormSchema = z.object({
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

export type FormValues = z.infer<typeof FormSchema>;

export type SectionStatus = "pending" | "active" | "saved";

// ── Field groups per section (used for per-section validation) ──────────────

export const section1Fields: (keyof FormValues)[] = ["area", "localityId"];

export const section2Fields = (isSell: boolean): (keyof FormValues)[] => [
  "title",
  "homeType",
  "bhk",
  "propertyAge",
  "floorType",
  "totalFloors",
  ...(isSell ? (["builtUpArea", "carpetArea", "ownershipType"] as (keyof FormValues)[]) : []),
];

export const section3FieldsSell: (keyof FormValues)[] = [
  "expectedPrice",
  "availableFrom",
  "contact",
];

export const section3FieldsRent: (keyof FormValues)[] = [
  "expectedRent",
  "expectedDeposit",
  "availableFrom",
  "furnished",
  "contact",
  "preferredTenants",
];

export const section4Fields: (keyof FormValues)[] = ["bathrooms", "whoShows"];

export const section5Fields = (isSell: boolean): (keyof FormValues)[] =>
  isSell
    ? [
        "khataCertificate",
        "saleDeedCertificate",
        "paidPropertyTax",
        "occupancyCertificate",
        "availabilityPeriod",
        "availabilityStartTime",
        "availabilityEndTime",
      ]
    : [];