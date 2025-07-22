ALTER TABLE "orders" ALTER COLUMN "total_price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "quote_details" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;