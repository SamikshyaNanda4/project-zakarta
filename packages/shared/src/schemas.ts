import { z } from "zod";

// ─────────────────────────────────────────────
// ENUM LITERALS (shared by form + API)
// ─────────────────────────────────────────────

export const AREAS = ["Bhubaneswar", "Cuttack", "Puri"] as const;
export const AreaSchema = z.enum(AREAS);
export type Area = z.infer<typeof AreaSchema>;

export const HOME_TYPES = [
  "apartment",
  "independent_house",
  "gated_community_villa",
  "standalone_building",
] as const;
export const HomeTypeSchema = z.enum(HOME_TYPES);
export type HomeType = z.infer<typeof HomeTypeSchema>;

export const BHK_VALUES = ["1RK", "1", "2", "3", "4", "5+"] as const;
export const BhkSchema = z.enum(BHK_VALUES);
export type Bhk = z.infer<typeof BhkSchema>;

export const OWNERSHIP_TYPES = ["self", "on_loan"] as const;
export const OwnershipTypeSchema = z.enum(OWNERSHIP_TYPES);

export const PROPERTY_AGES = [
  "<1yr",
  "1-3 years",
  "4-7 years",
  "7-10 years",
  "10 plus",
] as const;
export const PropertyAgeSchema = z.enum(PROPERTY_AGES);

export const FACINGS = [
  "north",
  "east",
  "south",
  "west",
  "north_east",
  "south_east",
  "north_west",
  "south_west",
  "dont_know",
] as const;
export const FacingSchema = z.enum(FACINGS);

export const FLOOR_TYPES = [
  "vitrified_tiles",
  "mosaic",
  "marble_granite",
  "cement",
  "wooden",
] as const;
export const FloorTypeSchema = z.enum(FLOOR_TYPES);

export const FURNISHED_VALUES = [
  "fully_furnished",
  "semi_furnished",
  "unfurnished",
] as const;
export const FurnishedSchema = z.enum(FURNISHED_VALUES);

export const PARKING_VALUES = ["bike", "car", "both", "none"] as const;
export const ParkingSchema = z.enum(PARKING_VALUES);

export const WHO_SHOWS = [
  "i",
  "neighbours",
  "friends",
  "relative",
  "security",
  "tenant",
  "others",
] as const;
export const WhoShowsSchema = z.enum(WHO_SHOWS);

export const KITCHEN_TYPES = ["modular", "covered", "open_shelves"] as const;
export const KitchenTypeSchema = z.enum(KITCHEN_TYPES);

export const KHATA_VALUES = ["a_khata", "b_khata", "no", "dont_know"] as const;
export const KhataSchema = z.enum(KHATA_VALUES);

export const YES_NO_DK = ["yes", "no", "dont_know"] as const;
export const YesNoDkSchema = z.enum(YES_NO_DK);

export const AVAILABILITY_PERIODS = ["everyday", "weekday", "weekend"] as const;
export const AvailabilityPeriodSchema = z.enum(AVAILABILITY_PERIODS);

export const CURRENT_SELL_STATUS = [
  "vacant",
  "tenant_staying",
  "tenant_on_notice",
  "self_occupied",
  "sell_urgent",
  "not_finding_tenants",
] as const;
export const CurrentSellStatusSchema = z.enum(CURRENT_SELL_STATUS);

export const WATER_SUPPLY = ["corporate", "borewell", "none"] as const;
export const WaterSupplySchema = z.enum(WATER_SUPPLY);

export const CURRENT_RENT_CONDITION = [
  "vacant",
  "tenant_on_notice",
  "new_property",
] as const;
export const CurrentRentConditionSchema = z.enum(CURRENT_RENT_CONDITION);

export const PREFERRED_TENANTS = [
  "anyone",
  "family",
  "female_bachelor",
  "male_bachelor",
  "company",
] as const;
export const PreferredTenantSchema = z.enum(PREFERRED_TENANTS);

export const POWER_BACKUP_VALUES = ["full", "partial", "none"] as const;
export const PowerBackupSchema = z.enum(POWER_BACKUP_VALUES);

// ─────────────────────────────────────────────
// LOCALITY
// ─────────────────────────────────────────────

export const LocalitySchema = z.object({
  id: z.string(),
  area: AreaSchema,
  name: z.string(),
});
export type Locality = z.infer<typeof LocalitySchema>;

// ─────────────────────────────────────────────
// SELL FORM  — section schemas for per-section validation
// ─────────────────────────────────────────────

export const SellLocalitySectionSchema = z.object({
  area: AreaSchema,
  localityId: z.string().min(1, "Please select a locality"),
});

export const SellAboutSectionSchema = z
  .object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(120, "Title is too long"),
    homeType: HomeTypeSchema,
    apartmentName: z.string().max(100).optional(),
    bhk: BhkSchema,
    ownershipType: OwnershipTypeSchema,
    builtUpArea: z
      .number({ error: "Enter a valid number" })
      .int()
      .min(1, "Built-up area must be at least 1 sqft"),
    carpetArea: z
      .number({ error: "Enter a valid number" })
      .int()
      .min(1, "Carpet area must be at least 1 sqft"),
    propertyAge: PropertyAgeSchema,
    facing: FacingSchema.optional(),
    floorType: FloorTypeSchema,
    floorNumber: z.number().int().optional(),
    totalFloors: z
      .number({ error: "Enter a valid number" })
      .int()
      .min(1, "Must have at least 1 floor"),
  })
  .refine(
    (d) => {
      if (d.homeType === "apartment" || d.homeType === "gated_community_villa") {
        return d.floorNumber !== undefined && d.floorNumber !== null;
      }
      return true;
    },
    { message: "Floor number is required for apartments and gated communities", path: ["floorNumber"] }
  );

export const SellDetailsSectionSchema = z.object({
  expectedPrice: z
    .number({ error: "Enter a valid price" })
    .positive("Price must be greater than 0"),
  availableFrom: z.string().min(1, "Please select a date"),
  maintenanceCost: z.number().optional(),
  description: z.string().max(1000, "Description must be under 1000 characters").optional(),
  kitchenType: KitchenTypeSchema.optional(),
  furnishedStatus: FurnishedSchema.optional(),
  parking: ParkingSchema.optional(),
  contact: z
    .string()
    .min(10, "Enter a valid contact number")
    .max(15, "Contact number is too long"),
});

export const SellAmenitiesSectionSchema = z.object({
  bathrooms: z
    .number({ error: "Enter a valid number" })
    .int()
    .min(1)
    .max(10000),
  kitchens: z
    .number({ error: "Enter a valid number" })
    .int()
    .min(1)
    .max(10000),
  whoShows: WhoShowsSchema,
  currentStatus: CurrentSellStatusSchema,
  // Amenities
  gym: z.boolean().default(false),
  powerBackup: PowerBackupSchema.default("none"),
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
});

export const SellAdditionalSectionSchema = z.object({
  khataCertificate: KhataSchema,
  allotmentLetter: YesNoDkSchema.optional(),
  saleDeedCertificate: YesNoDkSchema,
  paidPropertyTax: YesNoDkSchema,
  occupancyCertificate: YesNoDkSchema,
  availabilityPeriod: AvailabilityPeriodSchema,
  availabilityStartTime: z.string().min(1, "Select start time"),
  availabilityEndTime: z.string().min(1, "Select end time"),
}).refine(
  (d) => d.availabilityStartTime < d.availabilityEndTime,
  { message: "End time must be after start time", path: ["availabilityEndTime"] }
);

/** Full sell form — union of all sections */
export const CreateSellPropertySchema = SellLocalitySectionSchema
  .merge(SellAboutSectionSchema)
  .merge(SellDetailsSectionSchema)
  .merge(SellAmenitiesSectionSchema)
  .merge(SellAdditionalSectionSchema)
  .extend({
    photos: z.array(z.string().url()).max(6).optional(),
  });

export type CreateSellProperty = z.infer<typeof CreateSellPropertySchema>;

// ─────────────────────────────────────────────
// RENT FORM
// ─────────────────────────────────────────────

export const RentLocalitySectionSchema = SellLocalitySectionSchema;

export const RentAboutSectionSchema = z
  .object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(120, "Title is too long"),
    homeType: z.enum(["apartment", "independent_house", "gated_community_villa"]),
    bhk: BhkSchema,
    floorNumber: z.number().int().optional(),
    totalFloors: z
      .number({ error: "Enter a valid number" })
      .int()
      .min(1),
    propertyAge: PropertyAgeSchema,
    facing: FacingSchema.optional(),
    floorType: FloorTypeSchema,
    availableForLease: z.boolean().default(true),
  })
  .refine(
    (d) => {
      if (d.homeType === "apartment") {
        return d.floorNumber !== undefined;
      }
      return true;
    },
    { message: "Floor number is required for apartments", path: ["floorNumber"] }
  );

export const RentDetailsSectionSchema = z.object({
  expectedRent: z
    .number({ error: "Enter a valid rent amount" })
    .positive("Rent must be greater than 0"),
  expectedDeposit: z
    .number({ error: "Enter a valid deposit amount" })
    .min(0, "Deposit cannot be negative"),
  monthlyMaintenanceExtra: z.boolean().default(false),
  monthlyMaintenanceAmount: z.number().optional(),
  availableFrom: z.string().min(1, "Please select a date"),
  preferredTenants: z.array(PreferredTenantSchema).min(1, "Select at least one preferred tenant"),
  furnished: FurnishedSchema,
  parking: ParkingSchema.optional(),
  description: z.string().max(1000).optional(),
  contact: z
    .string()
    .min(10, "Enter a valid contact number")
    .max(15, "Contact number is too long"),
}).refine(
  (d) => {
    if (d.monthlyMaintenanceExtra) {
      return d.monthlyMaintenanceAmount !== undefined && d.monthlyMaintenanceAmount > 0;
    }
    return true;
  },
  { message: "Enter maintenance amount", path: ["monthlyMaintenanceAmount"] }
);

export const RentAmenitiesSectionSchema = z.object({
  bathrooms: z.number().int().min(1).max(10000),
  balcony: z.number().int().min(0).max(10000),
  waterSupply: WaterSupplySchema,
  petAllowed: z.boolean().default(false),
  gym: z.boolean().default(false),
  nonVegAllowed: z.boolean().default(false),
  gatedSecurity: z.boolean().default(false),
  whoShows: WhoShowsSchema,
  currentCondition: CurrentRentConditionSchema,
  directionDescription: z.string().max(1000).optional(),
  // Multi-select amenities
  lift: z.boolean().default(false),
  ac: z.boolean().default(false),
  intercom: z.boolean().default(false),
  childrenPlayArea: z.boolean().default(false),
  gasPipeline: z.boolean().default(false),
  rainwaterHarvesting: z.boolean().default(false),
  houseKeeping: z.boolean().default(false),
  visitorParking: z.boolean().default(false),
  internetServices: z.boolean().default(false),
  clubHouse: z.boolean().default(false),
  swimmingPool: z.boolean().default(false),
  fireSafety: z.boolean().default(false),
  shoppingCenter: z.boolean().default(false),
  park: z.boolean().default(false),
  sewageTreatment: z.boolean().default(false),
  powerBackup: z.boolean().default(false),
  washingMachine: z.boolean().default(false),
  laundry: z.boolean().default(false),
});

/** Full rent form */
export const CreateRentPropertySchema = RentLocalitySectionSchema
  .merge(RentAboutSectionSchema)
  .merge(RentDetailsSectionSchema)
  .merge(RentAmenitiesSectionSchema)
  .extend({
    photos: z.array(z.string().url()).max(5).optional(),
  });

export type CreateRentProperty = z.infer<typeof CreateRentPropertySchema>;

// ─────────────────────────────────────────────
// API REQUEST BODY (what the API receives)
// ─────────────────────────────────────────────

export const CreatePropertyBodySchema = z.discriminatedUnion("listingType", [
  z.object({ listingType: z.literal("sell") }).merge(CreateSellPropertySchema),
  z.object({ listingType: z.literal("rent") }).merge(CreateRentPropertySchema),
]);

export type CreatePropertyBody = z.infer<typeof CreatePropertyBodySchema>;

// ─────────────────────────────────────────────
// LEGACY — kept for any existing imports
// ─────────────────────────────────────────────

/** @deprecated Use CreateSellPropertySchema or CreateRentPropertySchema */
export const PropertyListingTypeSchema = z.enum(["sell", "rent"]);
export type PropertyListingType = z.infer<typeof PropertyListingTypeSchema>;

// ─────────────────────────────────────────────
// USER
// ─────────────────────────────────────────────

export const UserSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
});

export const CreateUserSchema = UserSchema.omit({ id: true });

export const UserParamsSchema = z.object({
  id: z.string().min(1),
});

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UserParams = z.infer<typeof UserParamsSchema>;

// ─────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type Pagination = z.infer<typeof PaginationSchema>;

// ─────────────────────────────────────────────
// API RESPONSES
// ─────────────────────────────────────────────

export const HealthResponseSchema = z.object({
  status: z.string(),
  timestamp: z.string(),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export function apiSuccess<T>(data: T) {
  return { success: true as const, data };
}

export function apiError(message: string, code?: string) {
  return { success: false as const, error: { message, code } };
}
