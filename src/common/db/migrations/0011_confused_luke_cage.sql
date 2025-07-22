ALTER TABLE "orders" DROP CONSTRAINT "orders_order_id_unique";--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "order_id" SET DATA TYPE serial;