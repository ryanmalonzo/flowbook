ALTER TABLE "categories" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "deleted_at" timestamp;