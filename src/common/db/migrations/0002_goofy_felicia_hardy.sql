CREATE TABLE "users_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"last_active" timestamp DEFAULT now(),
	"session_token" text NOT NULL,
	CONSTRAINT "users_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "users_session_token_unique" UNIQUE("session_token")
);
