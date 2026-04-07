import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  text,
  timestamp,
  boolean,
  index,
  integer,
  real,
  decimal,
  date,
  time,
  primaryKey,
} from "drizzle-orm/pg-core";

// ─────────────────────────────────────────────
// AUTH TABLES (unchanged)
// ─────────────────────────────────────────────

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  allowedToPost: boolean("allowed_to_post").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)]
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)]
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

// ─────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────

export const listingTypeEnum = pgEnum("listing_type", ["sell", "rent"]);
export const areaEnum = pgEnum("area", ["Bhubaneswar", "Cuttack", "Puri"]);
export const homeTypeEnum = pgEnum("home_type", [
  "apartment",
  "independent_house",
  "gated_community_villa",
  "standalone_building",
]);
export const bhkEnum = pgEnum("bhk", ["1RK", "1", "2", "3", "4", "5+"]);
export const ownershipTypeEnum = pgEnum("ownership_type", ["self", "on_loan"]);
export const propertyAgeEnum = pgEnum("property_age", [
  "<1yr",
  "1-3 years",
  "4-7 years",
  "7-10 years",
  "10 plus",
]);
export const facingEnum = pgEnum("facing", [
  "north",
  "east",
  "south",
  "west",
  "north_east",
  "south_east",
  "north_west",
  "south_west",
  "dont_know",
]);
export const floorTypeEnum = pgEnum("floor_type", [
  "vitrified_tiles",
  "mosaic",
  "marble_granite",
  "cement",
  "wooden",
]);
export const furnishedEnum = pgEnum("furnished", [
  "fully_furnished",
  "semi_furnished",
  "unfurnished",
]);
export const parkingEnum = pgEnum("parking", ["bike", "car", "both", "none"]);
export const whoShowsEnum = pgEnum("who_shows", [
  "i",
  "neighbours",
  "friends",
  "relative",
  "security",
  "tenant",
  "others",
]);
export const kitchenTypeEnum = pgEnum("kitchen_type", [
  "modular",
  "covered",
  "open_shelves",
]);
export const khataEnum = pgEnum("khata", [
  "a_khata",
  "b_khata",
  "no",
  "dont_know",
]);
export const yesNoDkEnum = pgEnum("yes_no_dk", ["yes", "no", "dont_know"]);
export const availabilityPeriodEnum = pgEnum("availability_period", [
  "everyday",
  "weekday",
  "weekend",
]);
export const currentSellStatusEnum = pgEnum("current_sell_status", [
  "vacant",
  "tenant_staying",
  "tenant_on_notice",
  "self_occupied",
  "sell_urgent",
  "not_finding_tenants",
]);
export const waterSupplyEnum = pgEnum("water_supply", [
  "corporate",
  "borewell",
  "none",
]);
export const currentRentConditionEnum = pgEnum("current_rent_condition", [
  "vacant",
  "tenant_on_notice",
  "new_property",
]);

// ─────────────────────────────────────────────
// LOCALITY
// ─────────────────────────────────────────────

export const locality = pgTable(
  "locality",
  {
    id: text("id").primaryKey(),
    area: areaEnum("area").notNull(),
    name: text("name").notNull(),
    lat: real("lat"),
    lng: real("lng"),
    perSqftRate: decimal("per_sqft_rate", { precision: 10, scale: 2 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("locality_area_idx").on(table.area)]
);

// ─────────────────────────────────────────────
// BASE PROPERTY
// ─────────────────────────────────────────────

export const property = pgTable(
  "property",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    localityId: text("locality_id")
      .notNull()
      .references(() => locality.id),
    listingType: listingTypeEnum("listing_type").notNull(),
    title: text("title").notNull(),
    contact: text("contact").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("property_userId_idx").on(table.userId),
    index("property_localityId_idx").on(table.localityId),
    index("property_listingType_idx").on(table.listingType),
  ]
);

// ─────────────────────────────────────────────
// SELL DETAILS
// ─────────────────────────────────────────────

export const propertySell = pgTable("property_sell", {
  id: text("id").primaryKey(),
  propertyId: text("property_id")
    .notNull()
    .unique()
    .references(() => property.id, { onDelete: "cascade" }),
  homeType: homeTypeEnum("home_type").notNull(),
  apartmentName: text("apartment_name"),
  bhk: bhkEnum("bhk").notNull(),
  ownershipType: ownershipTypeEnum("ownership_type").notNull(),
  builtUpArea: integer("built_up_area").notNull(),
  carpetArea: integer("carpet_area").notNull(),
  propertyAge: propertyAgeEnum("property_age").notNull(),
  facing: facingEnum("facing"),
  floorType: floorTypeEnum("floor_type").notNull(),
  floorNumber: integer("floor_number"),
  totalFloors: integer("total_floors").notNull(),
  expectedPrice: decimal("expected_price", { precision: 14, scale: 2 }).notNull(),
  availableFrom: date("available_from").notNull(),
  maintenanceCost: decimal("maintenance_cost", { precision: 14, scale: 2 }),
  description: text("description"),
  kitchenType: kitchenTypeEnum("kitchen_type"),
  furnishedStatus: furnishedEnum("furnished_status"),
  parking: parkingEnum("parking"),
  bathrooms: integer("bathrooms").notNull(),
  kitchens: integer("kitchens").notNull(),
  whoShows: whoShowsEnum("who_shows").notNull(),
  currentStatus: currentSellStatusEnum("current_status"),
  khataCertificate: khataEnum("khata_certificate"),
  allotmentLetter: yesNoDkEnum("allotment_letter"),
  saleDeedCertificate: yesNoDkEnum("sale_deed_certificate"),
  paidPropertyTax: yesNoDkEnum("paid_property_tax"),
  occupancyCertificate: yesNoDkEnum("occupancy_certificate"),
  availabilityPeriod: availabilityPeriodEnum("availability_period"),
  availabilityStartTime: time("availability_start_time"),
  availabilityEndTime: time("availability_end_time"),
});

// ─────────────────────────────────────────────
// RENT DETAILS
// ─────────────────────────────────────────────

export const propertyRent = pgTable("property_rent", {
  id: text("id").primaryKey(),
  propertyId: text("property_id")
    .notNull()
    .unique()
    .references(() => property.id, { onDelete: "cascade" }),
  homeType: homeTypeEnum("home_type").notNull(),
  bhk: bhkEnum("bhk").notNull(),
  floorNumber: integer("floor_number"),
  totalFloors: integer("total_floors").notNull(),
  propertyAge: propertyAgeEnum("property_age").notNull(),
  facing: facingEnum("facing"),
  floorType: floorTypeEnum("floor_type").notNull(),
  availableForLease: boolean("available_for_lease").default(true),
  expectedRent: decimal("expected_rent", { precision: 14, scale: 2 }).notNull(),
  expectedDeposit: decimal("expected_deposit", { precision: 14, scale: 2 }).notNull(),
  monthlyMaintenanceExtra: boolean("monthly_maintenance_extra").default(false),
  monthlyMaintenanceAmount: decimal("monthly_maintenance_amount", {
    precision: 14,
    scale: 2,
  }),
  availableFrom: date("available_from").notNull(),
  // preferred tenants stored as comma-separated text for simplicity
  preferredTenants: text("preferred_tenants"),
  furnished: furnishedEnum("furnished"),
  parking: parkingEnum("parking"),
  description: text("description"),
  bathrooms: integer("bathrooms").notNull(),
  balcony: integer("balcony").notNull().default(0),
  waterSupply: waterSupplyEnum("water_supply"),
  petAllowed: boolean("pet_allowed").default(false),
  gym: boolean("gym").default(false),
  nonVegAllowed: boolean("non_veg_allowed").default(false),
  gatedSecurity: boolean("gated_security").default(false),
  whoShows: whoShowsEnum("who_shows").notNull(),
  currentCondition: currentRentConditionEnum("current_condition").notNull(),
  directionDescription: text("direction_description"),
});

// ─────────────────────────────────────────────
// AMENITIES (key-value)
// ─────────────────────────────────────────────

export const sellAmenity = pgTable(
  "sell_amenity",
  {
    propertySellId: text("property_sell_id")
      .notNull()
      .references(() => propertySell.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    value: text("value").notNull(), // "yes"/"no" or "full"/"partial"/"none"
  },
  (table) => [primaryKey({ columns: [table.propertySellId, table.name] })]
);

export const rentAmenity = pgTable(
  "rent_amenity",
  {
    propertyRentId: text("property_rent_id")
      .notNull()
      .references(() => propertyRent.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    value: boolean("value").notNull(),
  },
  (table) => [primaryKey({ columns: [table.propertyRentId, table.name] })]
);

// ─────────────────────────────────────────────
// PHOTOS
// ─────────────────────────────────────────────

export const propertyPhoto = pgTable("property_photo", {
  id: text("id").primaryKey(),
  propertyId: text("property_id")
    .notNull()
    .references(() => property.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// RELATIONS
// ─────────────────────────────────────────────

export const userRelations = relations(user, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  properties: many(property),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, { fields: [session.userId], references: [user.id] }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, { fields: [account.userId], references: [user.id] }),
}));

export const localityRelations = relations(locality, ({ many }) => ({
  properties: many(property),
}));

export const propertyRelations = relations(property, ({ one, many }) => ({
  user: one(user, { fields: [property.userId], references: [user.id] }),
  locality: one(locality, {
    fields: [property.localityId],
    references: [locality.id],
  }),
  sellDetails: one(propertySell, {
    fields: [property.id],
    references: [propertySell.propertyId],
  }),
  rentDetails: one(propertyRent, {
    fields: [property.id],
    references: [propertyRent.propertyId],
  }),
  photos: many(propertyPhoto),
}));

export const propertySellRelations = relations(propertySell, ({ one, many }) => ({
  property: one(property, {
    fields: [propertySell.propertyId],
    references: [property.id],
  }),
  amenities: many(sellAmenity),
}));

export const propertyRentRelations = relations(propertyRent, ({ one, many }) => ({
  property: one(property, {
    fields: [propertyRent.propertyId],
    references: [property.id],
  }),
  amenities: many(rentAmenity),
}));

export const sellAmenityRelations = relations(sellAmenity, ({ one }) => ({
  propertySell: one(propertySell, {
    fields: [sellAmenity.propertySellId],
    references: [propertySell.id],
  }),
}));

export const rentAmenityRelations = relations(rentAmenity, ({ one }) => ({
  propertyRent: one(propertyRent, {
    fields: [rentAmenity.propertyRentId],
    references: [propertyRent.id],
  }),
}));

export const propertyPhotoRelations = relations(propertyPhoto, ({ one }) => ({
  property: one(property, {
    fields: [propertyPhoto.propertyId],
    references: [property.id],
  }),
}));
