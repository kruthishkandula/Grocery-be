import express from "express";
import { admin_authenticate } from "../../common/middleware";
import {
    createProduct,
    deleteProduct,
    getProductById,
    getProducts,
    getProductsByCategory,
    updateProduct
} from "./service";

const router = express.Router();

// All product operations require admin privileges
router.post("/list", getProducts); // No auth needed for viewing products
router.post("/detail", getProductById); // No auth needed for viewing a product
router.post("/by-category", getProductsByCategory); // No auth needed for viewing products by category

// Admin-only operations
router.post("/create", admin_authenticate, createProduct);
router.post("/update", admin_authenticate, updateProduct);
router.post("/delete", admin_authenticate, deleteProduct);

export { router as PRODUCTS };
