import { Request, Response } from "express";
import { getDashboardCms, updateDashboardCms } from "./dal";

// GET: Fetch dashboard CMS config
export const getDashboardConfig = async (req: Request, res: Response) => {
  try {
    const config = getDashboardCms();
    res.status(200).json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch dashboard config" });
  }
};

// POST: Update dashboard CMS config (admin only)
export const setDashboardConfig = async (req: Request, res: Response) => {
  try {
    const newConfig = req.body;
    if (!Array.isArray(newConfig)) {
      return res.status(400).json({ success: false, error: "Invalid config format" });
    }
    const updated = updateDashboardCms(newConfig);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update dashboard config" });
  }
};