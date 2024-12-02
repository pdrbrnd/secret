CREATE TABLE IF NOT EXISTS "draw_names" (
	"id" uuid,
	"draw_id" uuid NOT NULL,
	"name" text NOT NULL,
	"match" text NOT NULL,
	"is_redeemed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "draws" (
	"id" uuid
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "draw_names" ADD CONSTRAINT "draw_names_draw_id_draws_id_fk" FOREIGN KEY ("draw_id") REFERENCES "public"."draws"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
