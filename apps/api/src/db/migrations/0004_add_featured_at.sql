ALTER TABLE "property" ADD COLUMN "featured_at" timestamp;--> statement-breakpoint
CREATE INDEX "property_featuredAt_idx" ON "property" USING btree ("featured_at");
