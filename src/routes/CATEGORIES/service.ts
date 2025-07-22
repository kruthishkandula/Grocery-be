import { Request, Response } from "express";
import { 
  getAllCategories, 
  getCategoryById as getCategoryByIdFromDal, 
  createNewCategory, 
  updateExistingCategory, 
  deleteCategoryById 
} from "./dal";

// Get all categories with pagination and filtering
export const getCategories = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      pageSize = 10, 
      sortBy = "displayOrder", 
      sortOrder = "asc",
      searchValue = '',
      isActive
    } = req.body; // Using body instead of query params
    
    const categories = await getAllCategories({
      page: Number(page),
      pageSize: Number(pageSize),
      sortBy: sortBy as string,
      sortOrder: (sortOrder as 'asc' | 'desc') || 'asc',
      searchValue: searchValue as string,
      isActive: isActive !== undefined ? Boolean(isActive) : undefined
    });
    
    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return res.status(500).json({ 
      message: "Failed to fetch categories", 
      error: (error as Error).message 
    });
  }
};

// Get a category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.body; // Using body instead of params
    
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    
    const category = await getCategoryByIdFromDal(Number(id));
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    return res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return res.status(500).json({ 
      message: "Failed to fetch category", 
      error: (error as Error).message 
    });
  }
};

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const categoryData = req.body;
    
    // Validate required fields
    if (!categoryData.name) {
      return res.status(400).json({ message: "Category name is required" });
    }
    
    const newCategory = await createNewCategory(categoryData);
    return res.status(201).json({
      message: "Category created successfully",
      data: newCategory
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return res.status(500).json({ 
      message: "Failed to create category", 
      error: (error as Error).message 
    });
  }
};

// Update an existing category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id, ...categoryData } = req.body; // Using body for both id and data
    
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    
    // Check if category exists
    const existingCategory = await getCategoryByIdFromDal(Number(id));
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    const updatedCategory = await updateExistingCategory(Number(id), categoryData);
    
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found or no changes were made" });
    }
    
    return res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(500).json({ 
      message: "Failed to update category", 
      error: (error as Error).message 
    });
  }
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.body; // Using body instead of params
    
    if (!id) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    
    try {
      const deletedCategory = await deleteCategoryById(Number(id));
      
      if (!deletedCategory) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      return res.status(200).json({ 
        message: "Category deleted successfully",
        data: deletedCategory 
      });
    } catch (error) {
      if ((error as Error).message.includes('associated products')) {
        return res.status(409).json({ 
          message: "Cannot delete category with associated products",
          error: "REFERENCE_CONSTRAINT"
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    return res.status(500).json({ 
      message: "Failed to delete category", 
      error: (error as Error).message 
    });
  }
};