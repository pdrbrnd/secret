ALTER TABLE "draw_names" DROP CONSTRAINT "draw_names_draw_id_draws_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "draw_names" ADD CONSTRAINT "draw_names_draw_id_draws_id_fk" FOREIGN KEY ("draw_id") REFERENCES "public"."draws"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
