ALTER TABLE "payments" DROP CONSTRAINT "payments_order_id_orders_order_id_fk";
--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "order_id";