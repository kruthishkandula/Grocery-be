CREATE TABLE "image_uploads" (
	"id" serial PRIMARY KEY NOT NULL,
	"public_id" text NOT NULL,
	"url" text NOT NULL,
	"format" text,
	"resource_type" text,
	"folder" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "image_uploads_public_id_unique" UNIQUE("public_id")
);
