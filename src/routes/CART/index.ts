import express from "express";
import { authenticate } from "../../common/middleware";
import {
  deleteCartItem,
  getCart,
  getCartCount,
  updateCartItem,
} from "./service";

const router = express.Router();

router.use(authenticate); // All cart routes require authentication

router.get("/", getCart); // Get all cart items for user
router.get("/count", getCartCount); // Get all cart items for user
router.put("/:id", updateCartItem); // Update cart item quantity
router.delete("/:id", deleteCartItem); // Delete cart item

export { router as CART };
