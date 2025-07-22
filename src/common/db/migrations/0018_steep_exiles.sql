CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"published_at" timestamp,
	"image_url" text,
	"image_thumbnail_url" text
);
--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"url" text NOT NULL,
	"thumbnail_url" text,
	"display_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"name" varchar(255) NOT NULL,
	"sku" varchar(100),
	"price" numeric(10, 2),
	"discount_price" numeric(10, 2),
	"stock_quantity" integer DEFAULT 0,
	"weight" numeric(10, 2),
	"weight_unit" varchar(50),
	"is_default" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"short_description" text,
	"base_price" numeric(10, 2),
	"discount_price" numeric(10, 2),
	"cost_price" numeric(10, 2),
	"weight_unit" varchar(50),
	"is_active" boolean DEFAULT true,
	"currency" varchar(10) DEFAULT 'INR',
	"currency_symbol" varchar(10) DEFAULT '₹',
	"barcode" varchar(100),
	"brand" varchar(100),
	"category_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"published_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "product_variant_id" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;