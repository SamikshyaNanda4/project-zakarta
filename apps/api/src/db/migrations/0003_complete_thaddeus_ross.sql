-- Clear legacy property rows — they lack locality_id/title required by new schema
TRUNCATE TABLE "property" CASCADE;
--> statement-breakpoint
CREATE TYPE "public"."area" AS ENUM('Bhubaneswar', 'Cuttack', 'Puri');--> statement-breakpoint
CREATE TYPE "public"."availability_period" AS ENUM('everyday', 'weekday', 'weekend');--> statement-breakpoint
CREATE TYPE "public"."bhk" AS ENUM('1RK', '1', '2', '3', '4', '5+');--> statement-breakpoint
CREATE TYPE "public"."current_rent_condition" AS ENUM('vacant', 'tenant_on_notice', 'new_property');--> statement-breakpoint
CREATE TYPE "public"."current_sell_status" AS ENUM('vacant', 'tenant_staying', 'tenant_on_notice', 'self_occupied', 'sell_urgent', 'not_finding_tenants');--> statement-breakpoint
CREATE TYPE "public"."facing" AS ENUM('north', 'east', 'south', 'west', 'north_east', 'south_east', 'north_west', 'south_west', 'dont_know');--> statement-breakpoint
CREATE TYPE "public"."floor_type" AS ENUM('vitrified_tiles', 'mosaic', 'marble_granite', 'cement', 'wooden');--> statement-breakpoint
CREATE TYPE "public"."furnished" AS ENUM('fully_furnished', 'semi_furnished', 'unfurnished');--> statement-breakpoint
CREATE TYPE "public"."home_type" AS ENUM('apartment', 'independent_house', 'gated_community_villa', 'standalone_building');--> statement-breakpoint
CREATE TYPE "public"."khata" AS ENUM('a_khata', 'b_khata', 'no', 'dont_know');--> statement-breakpoint
CREATE TYPE "public"."kitchen_type" AS ENUM('modular', 'covered', 'open_shelves');--> statement-breakpoint
CREATE TYPE "public"."listing_type" AS ENUM('sell', 'rent');--> statement-breakpoint
CREATE TYPE "public"."ownership_type" AS ENUM('self', 'on_loan');--> statement-breakpoint
CREATE TYPE "public"."parking" AS ENUM('bike', 'car', 'both', 'none');--> statement-breakpoint
CREATE TYPE "public"."property_age" AS ENUM('<1yr', '1-3 years', '4-7 years', '7-10 years', '10 plus');--> statement-breakpoint
CREATE TYPE "public"."water_supply" AS ENUM('corporate', 'borewell', 'none');--> statement-breakpoint
CREATE TYPE "public"."who_shows" AS ENUM('i', 'neighbours', 'friends', 'relative', 'security', 'tenant', 'others');--> statement-breakpoint
CREATE TYPE "public"."yes_no_dk" AS ENUM('yes', 'no', 'dont_know');--> statement-breakpoint
CREATE TABLE "locality" (
	"id" text PRIMARY KEY NOT NULL,
	"area" "area" NOT NULL,
	"name" text NOT NULL,
	"lat" real,
	"lng" real,
	"per_sqft_rate" numeric(10, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "property_photo" (
	"id" text PRIMARY KEY NOT NULL,
	"property_id" text NOT NULL,
	"url" text NOT NULL,
	"order" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "property_rent" (
	"id" text PRIMARY KEY NOT NULL,
	"property_id" text NOT NULL,
	"home_type" "home_type" NOT NULL,
	"bhk" "bhk" NOT NULL,
	"floor_number" integer,
	"total_floors" integer NOT NULL,
	"property_age" "property_age" NOT NULL,
	"facing" "facing",
	"floor_type" "floor_type" NOT NULL,
	"available_for_lease" boolean DEFAULT true,
	"expected_rent" numeric(14, 2) NOT NULL,
	"expected_deposit" numeric(14, 2) NOT NULL,
	"monthly_maintenance_extra" boolean DEFAULT false,
	"monthly_maintenance_amount" numeric(14, 2),
	"available_from" date NOT NULL,
	"preferred_tenants" text,
	"furnished" "furnished",
	"parking" "parking",
	"description" text,
	"bathrooms" integer NOT NULL,
	"balcony" integer DEFAULT 0 NOT NULL,
	"water_supply" "water_supply",
	"pet_allowed" boolean DEFAULT false,
	"gym" boolean DEFAULT false,
	"non_veg_allowed" boolean DEFAULT false,
	"gated_security" boolean DEFAULT false,
	"who_shows" "who_shows" NOT NULL,
	"current_condition" "current_rent_condition" NOT NULL,
	"direction_description" text,
	CONSTRAINT "property_rent_property_id_unique" UNIQUE("property_id")
);
--> statement-breakpoint
CREATE TABLE "property_sell" (
	"id" text PRIMARY KEY NOT NULL,
	"property_id" text NOT NULL,
	"home_type" "home_type" NOT NULL,
	"apartment_name" text,
	"bhk" "bhk" NOT NULL,
	"ownership_type" "ownership_type" NOT NULL,
	"built_up_area" integer NOT NULL,
	"carpet_area" integer NOT NULL,
	"property_age" "property_age" NOT NULL,
	"facing" "facing",
	"floor_type" "floor_type" NOT NULL,
	"floor_number" integer,
	"total_floors" integer NOT NULL,
	"expected_price" numeric(14, 2) NOT NULL,
	"available_from" date NOT NULL,
	"maintenance_cost" numeric(14, 2),
	"description" text,
	"kitchen_type" "kitchen_type",
	"furnished_status" "furnished",
	"parking" "parking",
	"bathrooms" integer NOT NULL,
	"kitchens" integer NOT NULL,
	"who_shows" "who_shows" NOT NULL,
	"current_status" "current_sell_status",
	"khata_certificate" "khata",
	"allotment_letter" "yes_no_dk",
	"sale_deed_certificate" "yes_no_dk",
	"paid_property_tax" "yes_no_dk",
	"occupancy_certificate" "yes_no_dk",
	"availability_period" "availability_period",
	"availability_start_time" time,
	"availability_end_time" time,
	CONSTRAINT "property_sell_property_id_unique" UNIQUE("property_id")
);
--> statement-breakpoint
CREATE TABLE "rent_amenity" (
	"property_rent_id" text NOT NULL,
	"name" text NOT NULL,
	"value" boolean NOT NULL,
	CONSTRAINT "rent_amenity_property_rent_id_name_pk" PRIMARY KEY("property_rent_id","name")
);
--> statement-breakpoint
CREATE TABLE "sell_amenity" (
	"property_sell_id" text NOT NULL,
	"name" text NOT NULL,
	"value" text NOT NULL,
	CONSTRAINT "sell_amenity_property_sell_id_name_pk" PRIMARY KEY("property_sell_id","name")
);
--> statement-breakpoint
ALTER TABLE "property" ALTER COLUMN "listing_type" SET DATA TYPE "public"."listing_type" USING "listing_type"::"public"."listing_type";--> statement-breakpoint
ALTER TABLE "property" ALTER COLUMN "listing_type" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "locality_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "property_photo" ADD CONSTRAINT "property_photo_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_rent" ADD CONSTRAINT "property_rent_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_sell" ADD CONSTRAINT "property_sell_property_id_property_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."property"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rent_amenity" ADD CONSTRAINT "rent_amenity_property_rent_id_property_rent_id_fk" FOREIGN KEY ("property_rent_id") REFERENCES "public"."property_rent"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sell_amenity" ADD CONSTRAINT "sell_amenity_property_sell_id_property_sell_id_fk" FOREIGN KEY ("property_sell_id") REFERENCES "public"."property_sell"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "locality_area_idx" ON "locality" USING btree ("area");--> statement-breakpoint
ALTER TABLE "property" ADD CONSTRAINT "property_locality_id_locality_id_fk" FOREIGN KEY ("locality_id") REFERENCES "public"."locality"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "property_localityId_idx" ON "property" USING btree ("locality_id");--> statement-breakpoint
CREATE INDEX "property_listingType_idx" ON "property" USING btree ("listing_type");--> statement-breakpoint
ALTER TABLE "property" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "property" DROP COLUMN "bhk";--> statement-breakpoint
ALTER TABLE "property" DROP COLUMN "city";--> statement-breakpoint
ALTER TABLE "property" DROP COLUMN "price";--> statement-breakpoint
ALTER TABLE "property" DROP COLUMN "description";