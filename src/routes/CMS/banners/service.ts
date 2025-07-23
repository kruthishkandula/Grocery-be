import { Request, Response } from "express";
import { getBannersCms, updateBannersCms } from "./dal";

// POST: Update banners CMS config (admin only)

export const getBannersConfig = async (req: Request, res: Response) => {
  try {
    const config = await getBannersCms();
    res.status(200).json({ success: true, data: config });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to get banners config" });
  } 
};

export const setBannersConfig = async (req: Request, res: Response) => {
  try {
    const newConfig = req.body;
    if (!Array.isArray(newConfig)) {
      return res.status(400).json({ success: false, error: "Invalid config format" });
    }
    const updated = updateBannersCms(newConfig);
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update banners config" });
  }
};