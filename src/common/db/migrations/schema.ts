import { pgTable, unique, serial, uuid, text, timestamp, foreignKey, jsonb, varchar, boolean, integer, numeric, json, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const paymentMethods = pgEnum("payment_methods", ['credit_card', 'debit_card', 'upi', 'cod'])
export const paymentStatus = pgEnum("payment_status", ['pending', 'completed', 'failed', 'refunded'])
export const roles = pgEnum("roles", ['guest', 'user', 'admin'])
export const status = pgEnum("status", ['active', 'inactive', 'blocked'])


export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	email: text().notNull(),
	username: text().notNull(),
	phonenumber: text().notNull(),
	password: text().notNull(),
	profileImage: text("profile_image"),
	createdAt: timestamp({ mode: 'string' }).defaultNow(),
	role: roles().default('user'),
	status: status().default('active'),
}, (table) => [
	unique("users_user_id_unique").on(table.userId),
	unique("users_email_unique").on(table.email),
	unique("users_username_unique").on(table.username),
	unique("users_phonenumber_unique").on(table.phonenumber),
]);

export const wishlist = pgTable("wishlist", {
	id: serial().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	productId: text("product_id").notNull(),
	addedAt: timestamp("added_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "wishlist_user_id_users_user_id_fk"
		}),
]);

export const usersSessions = pgTable("users_sessions", {
	id: serial().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	lastActive: timestamp("last_active", { mode: 'string' }).defaultNow(),
	sessionToken: text("session_token").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "users_sessions_user_id_users_user_id_fk"
		}).onDelete("cascade"),
	unique("users_session_user_id_unique").on(table.userId),
	unique("users_session_token_unique").on(table.sessionToken),
]);

export const payments = pgTable("payments", {
	id: serial().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	paymentId: text("payment_id").notNull(),
	currency: text().default('INR').notNull(),
	amount: text().notNull(),
	status: paymentStatus().default('pending'),
	paymentMethod: paymentMethods().notNull().default('cod'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "payments_user_id_users_user_id_fk"
		}),
	unique("payments_payment_id_unique").on(table.paymentId),
]);

export const categories = pgTable("categories", {
	id: serial().primaryKey().notNull(),
	documentId: varchar("document_id", { length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	isActive: boolean("is_active").default(true),
	displayOrder: integer("display_order").default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	publishedAt: timestamp("published_at", { mode: 'string' }),
	imageUrl: text("image_url"),
	imageThumbnailUrl: text("image_thumbnail_url"),
});

export const products = pgTable("products", {
	id: serial().primaryKey().notNull(),
	documentId: varchar("document_id", { length: 255 }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	shortDescription: text("short_description"),
	basePrice: numeric("base_price", { precision: 10, scale:  2 }),
	discountPrice: numeric("discount_price", { precision: 10, scale:  2 }),
	costPrice: numeric("cost_price", { precision: 10, scale:  2 }),
	weightUnit: varchar("weight_unit", { length: 50 }),
	isActive: boolean("is_active").default(true),
	currency: varchar({ length: 10 }).default('INR'),
	currencySymbol: varchar("currency_symbol", { length: 10 }).default('₹'),
	barcode: varchar({ length: 100 }),
	brand: varchar({ length: 100 }),
	categoryId: integer("category_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	publishedAt: timestamp("published_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "products_category_id_fkey"
		}),
]);

export const cart = pgTable("cart", {
	id: serial().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	productVariantId: text("product_variant_id"),
	quantity: text().notNull(),
	addedAt: timestamp("added_at", { mode: 'string' }).defaultNow(),
	product: json(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "cart_user_id_fkey"
		}),
]);

export const productImages = pgTable("product_images", {
	id: serial().primaryKey().notNull(),
	productId: integer("product_id"),
	url: text().notNull(),
	thumbnailUrl: text("thumbnail_url"),
	displayOrder: integer("display_order").default(0),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "product_images_product_id_fkey"
		}),
]);

export const productVariants = pgTable("product_variants", {
	id: serial().primaryKey().notNull(),
	productId: integer("product_id"),
	name: varchar({ length: 255 }).notNull(),
	sku: varchar({ length: 100 }),
	price: numeric({ precision: 10, scale:  2 }),
	discountPrice: numeric("discount_price", { precision: 10, scale:  2 }),
	stockQuantity: integer("stock_quantity").default(0),
	weight: numeric({ precision: 10, scale:  2 }),
	weightUnit: varchar("weight_unit", { length: 50 }),
	isDefault: boolean("is_default").default(false),
	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "product_variants_product_id_fkey"
		}),
]);

export const banners = pgTable("banners", {
	id: serial().primaryKey().notNull(),
	documentId: varchar("document_id", { length: 255 }).notNull(),
	title: text(),
	description: text(),
	bannerType: varchar("banner_type", { length: 50 }),
	sortOrder: integer("sort_order").default(0),
	isActive: boolean("is_active").default(true),
	validFrom: timestamp("valid_from", { mode: 'string' }),
	validUntil: timestamp("valid_until", { mode: 'string' }),
	imageUrl: text("image_url"),
	imageThumbnailUrl: text("image_thumbnail_url"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	publishedAt: timestamp("published_at", { mode: 'string' }),
});




// orders table to store order details
export const orders = pgTable("orders", {
	orderId: text("order_id").primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
	deliveryAddress: text("delivery_address").notNull(),
	quoteDetails: jsonb("quote_details").notNull(), // Delivery fees, taxes, etc.
	paymentId: text("payment_id").notNull(),
	status: text("status").default('pending').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.userId],
			name: "orders_user_id_users_user_id_fk"
		}),
]);
export const orderItems = pgTable("order_items", {
	id: serial().primaryKey().notNull(),
	orderId: text("order_id").notNull(),
	productId: integer("product_id").notNull(),
	productVariantId: integer("product_variant_id"),
	quantity: integer().notNull(),
	unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
	totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
	productSnapshot: jsonb("product_snapshot").notNull(), // Snapshot of product at time of order
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.orderId],
			foreignColumns: [orders.orderId],
			name: "order_items_order_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "order_items_product_id_fk"
		}),
]);

export const imageUploads = pgTable("image_uploads", {
	id: serial().primaryKey().notNull(),
	publicId: text("public_id").notNull().unique(),
	url: text("url").notNull(),
	format: text("format"),
	resourceType: text("resource_type"),
	folder: text("folder"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});
