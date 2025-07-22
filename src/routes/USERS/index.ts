import express from "express";
import { authenticate } from "../../common/middleware";
import { getProfile } from "./service";

const router = express.Router();

// Make sure to use authentication middleware for the profile endpoint
router.post("/profile", authenticate, getProfile);

export { router as USERS };