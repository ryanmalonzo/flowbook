-- Soft delete existing credit accounts
UPDATE "financial_accounts" SET "deleted_at" = NOW() WHERE "type" = 'credit' AND "deleted_at" IS NULL;--> statement-breakpoint
ALTER TABLE "financial_accounts" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."account_type";--> statement-breakpoint
CREATE TYPE "public"."account_type" AS ENUM('checking', 'savings');--> statement-breakpoint
ALTER TABLE "financial_accounts" ALTER COLUMN "type" SET DATA TYPE "public"."account_type" USING "type"::"public"."account_type";