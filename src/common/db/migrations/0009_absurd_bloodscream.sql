ALTER TABLE "orders" ALTER COLUMN "order_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "quote_details" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_order_id_unique" UNIQUE("order_id");