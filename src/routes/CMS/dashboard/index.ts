import express from "express";
import { 
  getDashboardConfig, 
  getDashboardConfigWithData,
  setDashboardConfig,
  addDashboardSectionHandler,
  updateDashboardSectionHandler,
  deleteDashboardSectionHandler,
  reorderDashboardSectionsHandler,
  toggleDashboardSection
} from "./service";
import { admin_authenticate } from "../../../common/middleware";

const router = express.Router();

// Public routes (for mobile app)
router.post("/list", getDashboardConfig);
router.post("/list-with-data", getDashboardConfigWithData);

// Admin routes (require authentication)
router.post("/modify", admin_authenticate, setDashboardConfig);
router.post("/section", admin_authenticate, addDashboardSectionHandler);
router.put("/section/:key", admin_authenticate, updateDashboardSectionHandler);
router.delete("/section/:key", admin_authenticate, deleteDashboardSectionHandler);
router.post("/reorder", admin_authenticate, reorderDashboardSectionsHandler);
router.patch("/section/:key/toggle", admin_authenticate, toggleDashboardSection);

export { router as DASHBOARDCMS };
