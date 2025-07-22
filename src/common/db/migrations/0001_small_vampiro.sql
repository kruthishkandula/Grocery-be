ALTER TABLE "user_sessions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "user_sessions" CASCADE;--> statement-breakpoint
ALTER TABLE "cart" DROP CONSTRAINT "cart_user_id_users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "product_snapshot" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE no action ON UPDATE no action;