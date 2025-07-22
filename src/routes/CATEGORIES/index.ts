import express from "express";
import { admin_authenticate } from "../../common/middleware";
import {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} from "./service";

const router = express.Router();

// Public category routes - anyone can view categories
router.post("/list", getCategories);
router.post("/detail", getCategoryById);

// Admin-only category routes
router.post("/create", admin_authenticate, createCategory);
router.post("/update", admin_authenticate, updateCategory);
router.post("/delete", admin_authenticate, deleteCategory);

export { router as CATEGORIES };