ALTER TABLE "users_sessions" DROP CONSTRAINT "users_user_id_unique";--> statement-breakpoint
ALTER TABLE "users_sessions" ADD CONSTRAINT "users_user_id_unique" UNIQUE("user_id");