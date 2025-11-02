CREATE TYPE "public"."currency" AS ENUM('AUD', 'BGN', 'BRL', 'CAD', 'CHF', 'CNY', 'CZK', 'DKK', 'EUR', 'GBP', 'HKD', 'HUF', 'IDR', 'ILS', 'INR', 'ISK', 'JPY', 'KRW', 'MXN', 'MYR', 'NOK', 'NZD', 'PHP', 'PLN', 'RON', 'SEK', 'SGD', 'THB', 'TRY', 'USD', 'ZAR');--> statement-breakpoint
CREATE TABLE "exchange_rates" (
	"id" text PRIMARY KEY NOT NULL,
	"base_currency" "currency" NOT NULL,
	"target_currency" "currency" NOT NULL,
	"rate" numeric(10, 6) NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "exchange_rates_base_currency_target_currency_unique" UNIQUE("base_currency","target_currency")
);
--> statement-breakpoint
ALTER TABLE "financial_accounts" ALTER COLUMN "currency" SET DEFAULT 'USD'::"public"."currency";--> statement-breakpoint
ALTER TABLE "financial_accounts" ALTER COLUMN "currency" SET DATA TYPE "public"."currency" USING "currency"::"public"."currency";--> statement-breakpoint
ALTER TABLE "user_settings" ALTER COLUMN "currency" SET DEFAULT 'USD'::"public"."currency";--> statement-breakpoint
ALTER TABLE "user_settings" ALTER COLUMN "currency" SET DATA TYPE "public"."currency" USING "currency"::"public"."currency";