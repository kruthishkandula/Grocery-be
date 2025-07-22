CREATE TYPE "public"."payment_status" AS ENUM('pending', 'completed', 'failed', 'refunded');--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"payment_id" text NOT NULL,
	"order_id" text NOT NULL,
	"currency" text DEFAULT 'INR' NOT NULL,
	"amount" text NOT NULL,
	"status" "payment_status" DEFAULT 'pending',
	"payment_method" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "payments_payment_id_unique" UNIQUE("payment_id")
);
--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "product_variant_id" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "payment_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_order_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("order_id") ON DELETE no action ON UPDATE no action;