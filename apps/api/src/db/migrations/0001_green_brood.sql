CREATE TABLE "property" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"bhk" integer NOT NULL,
	"contact" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "allowed_to_post" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "property" ADD CONSTRAINT "property_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "property_userId_idx" ON "property" USING btree ("user_id");