CREATE TYPE "public"."payment_methods" AS ENUM('credit_card', 'debit_card', 'upi', 'cod');--> statement-breakpoint
ALTER TABLE "payments" RENAME COLUMN "payment_method" TO "paymentMethod";