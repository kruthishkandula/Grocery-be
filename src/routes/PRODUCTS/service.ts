import { Request, Response } from "express";
import { 
  getAllProducts, 
  getProductById as getProduct, 
  getProductsByCategory as getProductsByCat,
  createNewProduct,
  updateExistingProduct,
  deleteProductById
} from "./dal";

// Get all products with pagination
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      pageSize = 10, 
      sortBy = "updatedAt", 
      sortOrder = "desc",
      searchValue = '',
      priceMin,
      priceMax,
      categoryId,
      isActive
    } = req.body; // Using req.body for all parameters
    
    const products = await getAllProducts({
      page: Number(page),
      pageSize: Number(pageSize),
      sortBy: sortBy as string,
      sortOrder: (sortOrder as 'asc' | 'desc') || 'desc',
      searchValue: searchValue as string,
      priceMin: priceMin !== undefined ? Number(priceMin) : undefined,
      priceMax: priceMax !== undefined ? Number(priceMax) : undefined,
      categoryId: categoryId !== undefined ? Number(categoryId) : undefined,
      isActive: isActive !== undefined ? Boolean(isActive) : undefined
    });
    
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ 
      message: "Failed to fetch products", 
      error: (error as Error).message 
    });
  }
};

// Get a product by ID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.body; // Changed from req.params to req.body
    
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    const product = await getProduct(Number(id));
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    return res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ 
      message: "Failed to fetch product", 
      error: (error as Error).message 
    });
  }
};

// Get products by category
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { 
      categoryId,
      page = 1, 
      pageSize = 10, 
      sortBy = "created_at", 
      sortOrder = "desc" 
    } = req.body; // Changed from req.params and req.query to req.body
    
    if (!categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    
    const products = await getProductsByCat(Number(categoryId), {
      page: Number(page),
      pageSize: Number(pageSize),
      sortBy: sortBy as string,
      sortOrder: (sortOrder as 'asc' | 'desc') || 'desc'
    });
    
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return res.status(500).json({ 
      message: "Failed to fetch products by category", 
      error: (error as Error).message 
    });
  }
};

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const productData = req.body;
    
    // Validate required fields
    if (!productData.name) {
      return res.status(400).json({ message: "Product name is required" });
    }
    
    if (!productData.categoryId) {
      return res.status(400).json({ message: "Category ID is required" });
    }
    
    const newProduct = await createNewProduct(productData);
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({ 
      message: "Failed to create product", 
      error: (error as Error).message 
    });
  }
};

// Update an existing product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id, ...productData } = req.body; // Changed from req.params to req.body
    
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    // Check if product exists
    const existingProduct = await getProduct(Number(id));
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    const updatedProduct = await updateExistingProduct(Number(id), productData);
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({ 
      message: "Failed to update product", 
      error: (error as Error).message 
    });
  }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.body; // Changed from req.params to req.body
    
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    
    // Check if product exists
    const existingProduct = await getProduct(Number(id));
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    await deleteProductById(Number(id));
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ 
      message: "Failed to delete product", 
      error: (error as Error).message 
    });
  }
};