import { Request, Response } from "express";
import {
  addDashboardSection,
  DashboardSection,
  deleteDashboardSection,
  getDashboardCms,
  reorderDashboardSections,
  updateDashboardCms,
  updateDashboardSection
} from "./dal";



// GET: Fetch dashboard config with actual data populated
export const getDashboardConfigWithData = async (req: Request, res: Response) => {
  try {
    const config = getDashboardCms();

    res.status(200).json({
      success: true,
      data: config,
      message: "Dashboard configuration with data fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching dashboard config with data:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch dashboard config with data"
    });
  }
};








// GET: Fetch dashboard CMS config
export const getDashboardConfig = async (req: Request, res: Response) => {
  try {
    const config = getDashboardCms();
    res.status(200).json({
      success: true,
      data: config,
      message: "Dashboard configuration fetched successfully"
    });
  } catch (error) {
    console.error("Error fetching dashboard config:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch dashboard config"
    });
  }
};


// POST: Update entire dashboard CMS config
export const setDashboardConfig = async (req: Request, res: Response) => {
  try {
    const newConfig: DashboardSection[] = req.body;

    if (!Array.isArray(newConfig)) {
      return res.status(400).json({
        success: false,
        error: "Invalid config format. Expected an array of dashboard sections."
      });
    }

    // Validate each section
    for (const section of newConfig) {
      if (!section.key || !section.title || !section.type) {
        return res.status(400).json({
          success: false,
          error: "Each section must have key, title, and type properties"
        });
      }

      if (!['category', 'product', 'banner'].includes(section.type)) {
        return res.status(400).json({
          success: false,
          error: "Section type must be 'category', 'product', or 'banner'"
        });
      }
    }

    const updated = updateDashboardCms(newConfig);
    res.status(200).json({
      success: true,
      data: updated,
      message: "Dashboard configuration updated successfully"
    });
  } catch (error) {
    console.error("Error updating dashboard config:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update dashboard config"
    });
  }
};

// POST: Add new dashboard section
export const addDashboardSectionHandler = async (req: Request, res: Response) => {
  try {
    const sectionData = req.body;

    if (!sectionData.key || !sectionData.title || !sectionData.type) {
      return res.status(400).json({
        success: false,
        error: "Section must have key, title, and type properties"
      });
    }

    const updated = addDashboardSection(sectionData);
    res.status(201).json({
      success: true,
      data: updated,
      message: "Dashboard section added successfully"
    });
  } catch (error) {
    console.error("Error adding dashboard section:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add dashboard section"
    });
  }
};

// PUT: Update specific dashboard section
export const updateDashboardSectionHandler = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const updates = req.body;

    if (!key) {
      return res.status(400).json({
        success: false,
        error: "Section key is required"
      });
    }

    const updated = updateDashboardSection(key, updates);
    res.status(200).json({
      success: true,
      data: updated,
      message: "Dashboard section updated successfully"
    });
  } catch (error) {
    console.error("Error updating dashboard section:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update dashboard section"
    });
  }
};

// DELETE: Remove dashboard section
export const deleteDashboardSectionHandler = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;

    if (!key) {
      return res.status(400).json({
        success: false,
        error: "Section key is required"
      });
    }

    const updated = deleteDashboardSection(key);
    res.status(200).json({
      success: true,
      data: updated,
      message: "Dashboard section deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting dashboard section:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete dashboard section"
    });
  }
};

// POST: Reorder dashboard sections
export const reorderDashboardSectionsHandler = async (req: Request, res: Response) => {
  try {
    const { orderedKeys } = req.body;

    if (!Array.isArray(orderedKeys)) {
      return res.status(400).json({
        success: false,
        error: "orderedKeys must be an array of section keys"
      });
    }

    const updated = reorderDashboardSections(orderedKeys);
    res.status(200).json({
      success: true,
      data: updated,
      message: "Dashboard sections reordered successfully"
    });
  } catch (error) {
    console.error("Error reordering dashboard sections:", error);
    res.status(500).json({
      success: false,
      error: "Failed to reorder dashboard sections"
    });
  }
};

// POST: Toggle section enabled/disabled
export const toggleDashboardSection = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const { enabled } = req.body;

    if (!key) {
      return res.status(400).json({
        success: false,
        error: "Section key is required"
      });
    }

    const updated = updateDashboardSection(key, { enabled: enabled !== undefined ? enabled : true });
    res.status(200).json({
      success: true,
      data: updated,
      message: `Dashboard section ${enabled ? 'enabled' : 'disabled'} successfully`
    });
  } catch (error) {
    console.error("Error toggling dashboard section:", error);
    res.status(500).json({
      success: false,
      error: "Failed to toggle dashboard section"
    });
  }
};