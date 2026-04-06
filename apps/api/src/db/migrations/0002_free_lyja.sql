ALTER TABLE "property" ADD COLUMN "listing_type" text DEFAULT 'sell' NOT NULL;--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "city" text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "price" text;--> statement-breakpoint
ALTER TABLE "property" ADD COLUMN "description" text;