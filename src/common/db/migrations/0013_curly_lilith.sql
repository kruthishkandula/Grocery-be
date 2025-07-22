ALTER TABLE "orders" DROP CONSTRAINT "orders_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "total_price" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "quote_details" DROP NOT NULL;