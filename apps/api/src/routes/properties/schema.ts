import { z } from "@hono/zod-openapi";

// ─────────────────────────────────────────────
// PARAMS / SHARED
// ─────────────────────────────────────────────

export const PropertyParamsSchema = z
  .object({ id: z.string().min(1).openapi({ example: "prop_abc123" }) })
  .openapi("PropertyParams");

export const ErrorSchema = z
  .object({ error: z.string() })
  .openapi("ErrorResponse");

// ─────────────────────────────────────────────
// PUBLIC PROPERTY (list / detail — no contact)
// ─────────────────────────────────────────────

export const PropertyPublicSchema = z
  .object({
    id: z.string().openapi({ example: "prop_abc123" }),
    title: z.string().openapi({ example: "Spacious 2BHK near Kalinga Stadium" }),
    listingType: z.enum(["sell", "rent"]).openapi({ example: "sell" }),
    localityId: z.string().openapi({ example: "loc_bbsr_0001" }),
    localityName: z.string().openapi({ example: "Patia" }),
    area: z.string().openapi({ example: "Bhubaneswar" }),
    bhk: z.string().openapi({ example: "2" }),
    userId: z.string().openapi({ example: "user_xyz" }),
    createdAt: z.string().openapi({ example: "2026-04-07T10:00:00.000Z" }),
    // sell fields (nullable when rent)
    expectedPrice: z.string().nullable().openapi({ example: "45.00" }),
    // rent fields (nullable when sell)
    expectedRent: z.string().nullable().openapi({ example: null }),
    description: z.string().nullable(),
    homeType: z.string().nullable(),
    photos: z.array(z.object({ url: z.string(), order: z.number() })),
  })
  .openapi("PropertyPublic");

export const PropertyListResponseSchema = z
  .object({
    properties: z.array(PropertyPublicSchema),
    total: z.number().int(),
  })
  .openapi("PropertyListResponse");

// ─────────────────────────────────────────────
// CREATE REQUEST BODY
// ─────────────────────────────────────────────

const SellAmenitiesSchema = z.object({
  gym: z.boolean().default(false),
  powerBackup: z.enum(["full", "partial", "none"]).default("none"),
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

const RentAmenitiesSchema = z.object({
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

const PhotoInputSchema = z.object({
  url: z.string(),
  order: z.number().int().min(1),
});

export const CreateSellPropertyBodySchema = z
  .object({
    listingType: z.literal("sell"),
    title: z.string().min(5).max(120).openapi({ example: "Spacious 2BHK in Patia" }),
    contact: z.string().min(10).max(15).openapi({ example: "+91 98765 43210" }),
    localityId: z.string().min(1),
    // About
    homeType: z.enum([
      "apartment",
      "independent_house",
      "gated_community_villa",
      "standalone_building",
    ]),
    apartmentName: z.string().max(100).optional(),
    bhk: z.enum(["1RK", "1", "2", "3", "4", "5+"]),
    ownershipType: z.enum(["self", "on_loan"]),
    builtUpArea: z.number().int().min(1),
    carpetArea: z.number().int().min(1),
    propertyAge: z.enum(["<1yr", "1-3 years", "4-7 years", "7-10 years", "10 plus"]),
    facing: z
      .enum([
        "north",
        "east",
        "south",
        "west",
        "north_east",
        "south_east",
        "north_west",
        "south_west",
        "dont_know",
      ])
      .optional(),
    floorType: z.enum(["vitrified_tiles", "mosaic", "marble_granite", "cement", "wooden"]),
    floorNumber: z.number().int().optional(),
    totalFloors: z.number().int().min(1),
    // Sale details
    expectedPrice: z.number().positive(),
    availableFrom: z.string().min(1),
    maintenanceCost: z.number().optional(),
    description: z.string().max(1000).optional(),
    kitchenType: z.enum(["modular", "covered", "open_shelves"]).optional(),
    furnishedStatus: z.enum(["fully_furnished", "semi_furnished", "unfurnished"]).optional(),
    parking: z.enum(["bike", "car", "both", "none"]).optional(),
    // Amenities section
    bathrooms: z.number().int().min(1).max(10000),
    kitchens: z.number().int().min(1).max(10000),
    whoShows: z.enum(["i", "neighbours", "friends", "relative", "security", "tenant", "others"]),
    currentStatus: z
      .enum([
        "vacant",
        "tenant_staying",
        "tenant_on_notice",
        "self_occupied",
        "sell_urgent",
        "not_finding_tenants",
      ])
      .optional(),
    amenities: SellAmenitiesSchema,
    // Additional info
    khataCertificate: z.enum(["a_khata", "b_khata", "no", "dont_know"]).optional(),
    allotmentLetter: z.enum(["yes", "no", "dont_know"]).optional(),
    saleDeedCertificate: z.enum(["yes", "no", "dont_know"]).optional(),
    paidPropertyTax: z.enum(["yes", "no", "dont_know"]).optional(),
    occupancyCertificate: z.enum(["yes", "no", "dont_know"]).optional(),
    availabilityPeriod: z.enum(["everyday", "weekday", "weekend"]).optional(),
    availabilityStartTime: z.string().optional(),
    availabilityEndTime: z.string().optional(),
    // Photos
    photos: z.array(PhotoInputSchema).max(6).optional(),
  })
  .openapi("CreateSellPropertyBody");

export const CreateRentPropertyBodySchema = z
  .object({
    listingType: z.literal("rent"),
    title: z.string().min(5).max(120).openapi({ example: "2BHK for rent in Sailashree Vihar" }),
    contact: z.string().min(10).max(15).openapi({ example: "+91 98765 43210" }),
    localityId: z.string().min(1),
    // About
    homeType: z.enum(["apartment", "independent_house", "gated_community_villa"]),
    bhk: z.enum(["1RK", "1", "2", "3", "4", "5+"]),
    floorNumber: z.number().int().optional(),
    totalFloors: z.number().int().min(1),
    propertyAge: z.enum(["<1yr", "1-3 years", "4-7 years", "7-10 years", "10 plus"]),
    facing: z
      .enum([
        "north",
        "east",
        "south",
        "west",
        "north_east",
        "south_east",
        "north_west",
        "south_west",
        "dont_know",
      ])
      .optional(),
    floorType: z.enum(["vitrified_tiles", "mosaic", "marble_granite", "cement", "wooden"]),
    availableForLease: z.boolean().default(true),
    // Rent details
    expectedRent: z.number().positive(),
    expectedDeposit: z.number().min(0),
    monthlyMaintenanceExtra: z.boolean().default(false),
    monthlyMaintenanceAmount: z.number().optional(),
    availableFrom: z.string().min(1),
    preferredTenants: z.array(
      z.enum(["anyone", "family", "female_bachelor", "male_bachelor", "company"])
    ),
    furnished: z.enum(["fully_furnished", "semi_furnished", "unfurnished"]),
    parking: z.enum(["bike", "car", "both", "none"]).optional(),
    description: z.string().max(1000).optional(),
    // Amenities
    bathrooms: z.number().int().min(1).max(10000),
    balcony: z.number().int().min(0).max(10000),
    waterSupply: z.enum(["corporate", "borewell", "none"]).optional(),
    petAllowed: z.boolean().default(false),
    gym: z.boolean().default(false),
    nonVegAllowed: z.boolean().default(false),
    gatedSecurity: z.boolean().default(false),
    whoShows: z.enum(["i", "neighbours", "friends", "relative", "security", "tenant", "others"]),
    currentCondition: z.enum(["vacant", "tenant_on_notice", "new_property"]),
    directionDescription: z.string().max(1000).optional(),
    amenities: RentAmenitiesSchema,
    // Photos
    photos: z.array(PhotoInputSchema).max(5).optional(),
  })
  .openapi("CreateRentPropertyBody");

export const CreatePropertyBodySchema = z
  .discriminatedUnion("listingType", [
    CreateSellPropertyBodySchema,
    CreateRentPropertyBodySchema,
  ])
  .openapi("CreatePropertyBody");

export const CreatePropertyResponseSchema = PropertyPublicSchema.openapi(
  "CreatePropertyResponse"
);

// ─────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────

export const ContactResponseSchema = z
  .object({ contact: z.string().openapi({ example: "+91 98765 43210" }) })
  .openapi("ContactResponse");
