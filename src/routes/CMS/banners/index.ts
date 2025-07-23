import express from "express";
import { getBannersConfig, setBannersConfig } from "./service";
import { admin_authenticate } from "../../../common/middleware";

const router = express.Router();

router.post("/list", getBannersConfig);
router.post("/modify", admin_authenticate, setBannersConfig);

export { router as BANNERSCMS };