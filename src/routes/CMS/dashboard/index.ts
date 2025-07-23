import express from "express";
import { getDashboardConfig, setDashboardConfig } from "./service";
import { admin_authenticate } from "../../../common/middleware";

const router = express.Router();

router.post("/list", getDashboardConfig);
router.post("/modify", admin_authenticate, setDashboardConfig);

export { router as DASHBOARDCMS };