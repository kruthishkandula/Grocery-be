ALTER TABLE "orders" ALTER COLUMN "product_variant_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "product_id" text NOT NULL;