import { and, count, eq } from "drizzle-orm";
import { cart } from "../../common/db/migrations/schema";
import { STATUS_TYPES } from "../../common/enums";
import { cmsApi } from "../../config/axios";
import { db } from "../../config/db";
import { cms_urls } from "../../constants/urls";
import { Request, Response } from "express";



// Get All Cart Items for User
export const getCart = async (req: Request, res: Response) => {
  try {
    const user_id = req.user?.user_id;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is missing" });
    }
    
    const items = await db
      .select()
      .from(cart)
      .where(eq(cart.userId, user_id));

    // Collect all product_variant_ids from cart items
    const productVariantIds = items.map((item: any) => item.product_variant_id);

    // Call fetchProducts endpoint on CMS API
    let products = [];
    if (productVariantIds.length > 0) {
      const response = await cmsApi.get(
        `${cms_urls?.products}?populate=*&ids[]=${productVariantIds.join(
          "&ids[]="
        )}`
      );
      console.log("response", response);
      products = response.data?.data || [];
    }

    // Optionally, merge product info into cart items
    const itemsWithProductInfo = items.map((item: any) => ({
      cart_id: item.id,
      ...item,
      product: products?.find((p: any) => p.id == item.product_variant_id) || null,
    }))?.filter((item) => item.product !== null);

    res.status(200).json({
      status: STATUS_TYPES.SUCCESS,
      message: "Cart items fetched successfully",
      result: itemsWithProductInfo,
    });
  } catch (error: any) {
    console.log("error---", error);
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
};

// Get All Cart Items for User
export const getCartCount = async (req: any, res: Response) => {
  try {
    const user_id = req.user.user_id;
    const items = await db
      .select({ count: count() })
      .from(cart)
      .where(eq(cart.userId, user_id));

    console.log("items", items);
    res.json({
      result: {
        count: items[0]?.count || 0,
      },
      message: "Cart item count fetched successfully",
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching cart", error: error.message });
  }
};

// Update Cart Item
export const updateCartItem = async (req: any, res: Response) => {
  try {
    const { id: product_id } = req.params;
    const { quantity } = req.body;
    const user_id = req.user.user_id;

    if (!product_id || !quantity) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const [itemExists] = await db
      .select()
      .from(cart)
      .where(
        and(
          eq(cart.userId, user_id),
          eq(cart.productVariantId, product_id)
        )
      );

    if (itemExists) {
      // If item exists, update the quantity
      const [updatedItem] = await db
        .update(cart)
        .set({ quantity })
        .where(eq(cart.id, itemExists.id))
        .returning();

      return res.status(200).json({
        status: STATUS_TYPES.SUCCESS,
        message: "Item updated in cart",
        result: updatedItem,
      });
    }

    const [item] = await db
      .insert(cart)
      .values({ userId: user_id, productVariantId: product_id, quantity })
      .returning();

    res.status(201).json({
      status: STATUS_TYPES.SUCCESS,
      message: "Item added to cart",
      result: item,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating cart", error: error.message });
  }
};

// Delete Cart Item
export const deleteCartItem = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id;

    const [deleted] = await db
      .delete(cart)
      .where(and(eq(cart.id, id), eq(cart.userId, user_id)))
      .returning();

    if (!deleted)
      return res.status(404).json({ message: "Cart item not found" });
    res.json({ message: "Deleted", deleted });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting cart item", error: error.message });
  }
};
