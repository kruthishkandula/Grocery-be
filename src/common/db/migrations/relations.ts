import { relations } from "drizzle-orm/relations";
import { users, wishlist, orders, usersSessions, payments, categories, products, cart, productImages, productVariants } from "./schema";

export const wishlistRelations = relations(wishlist, ({one}) => ({
	user: one(users, {
		fields: [wishlist.userId],
		references: [users.userId]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	wishlists: many(wishlist),
	orders: many(orders),
	usersSessions: many(usersSessions),
	payments: many(payments),
	carts: many(cart),
}));

export const ordersRelations = relations(orders, ({one}) => ({
	user: one(users, {
		fields: [orders.userId],
		references: [users.userId]
	}),
}));

export const usersSessionsRelations = relations(usersSessions, ({one}) => ({
	user: one(users, {
		fields: [usersSessions.userId],
		references: [users.userId]
	}),
}));

export const paymentsRelations = relations(payments, ({one}) => ({
	user: one(users, {
		fields: [payments.userId],
		references: [users.userId]
	}),
}));

export const productsRelations = relations(products, ({one, many}) => ({
	category: one(categories, {
		fields: [products.categoryId],
		references: [categories.id]
	}),
	productImages: many(productImages),
	productVariants: many(productVariants),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	products: many(products),
}));

export const cartRelations = relations(cart, ({one}) => ({
	user: one(users, {
		fields: [cart.userId],
		references: [users.userId]
	}),
}));

export const productImagesRelations = relations(productImages, ({one}) => ({
	product: one(products, {
		fields: [productImages.productId],
		references: [products.id]
	}),
}));

export const productVariantsRelations = relations(productVariants, ({one}) => ({
	product: one(products, {
		fields: [productVariants.productId],
		references: [products.id]
	}),
}));