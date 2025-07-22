import { db } from "../../config/db";
import { sql } from "drizzle-orm";
import crypto from 'crypto';

type PaginationParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  searchValue?: string;
  isActive?: boolean;
};

export async function getAllCategories({ 
  page = 1, 
  pageSize = 10, 
  sortBy = 'display_order', 
  sortOrder = 'asc',
  searchValue = '',
  isActive
}: PaginationParams) {
  try {
    // Build WHERE conditions
    const conditions = [];
    
    if (searchValue) {
      conditions.push(`(name ILIKE '%${searchValue}%' OR description ILIKE '%${searchValue}%')`);
    }
    
    if (isActive !== undefined) {
      conditions.push(`is_active = ${isActive}`);
    }
    
    const whereClause = conditions.length > 0 
      ? `WHERE ${conditions.join(' AND ')}` 
      : '';
    
    // Map sortBy to database column name
    const sortByMap: Record<string, string> = {
      'displayOrder': 'display_order',
      'name': 'name',
      'updatedAt': 'updated_at',
      'createdAt': 'created_at'
    };
    
    const dbSortBy = sortByMap[sortBy] || 'display_order';
    
    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) AS total 
      FROM categories
      ${whereClause}
    `;
    
    const countResult = await db.execute(countQuery);
    const totalCount = Number(countResult.rows[0]?.total || 0);
    
    // Calculate offset
    const offset = (page - 1) * pageSize;
    
    // Get categories with pagination
    const categoriesQuery = `
      SELECT 
        id, document_id, name, description,
        is_active, display_order, image_url, image_thumbnail_url,
        created_at, updated_at
      FROM categories
      ${whereClause}
      ORDER BY ${dbSortBy} ${sortOrder.toUpperCase()}
      LIMIT ${pageSize} OFFSET ${offset}
    `;
    
    const categoriesResult = await db.execute(categoriesQuery);
    
    // Format categories
    const categoriesList = categoriesResult.rows.map(row => ({
      id: row.id,
      documentId: row.document_id,
      name: row.name,
      description: row.description,
      isActive: row.is_active,
      displayOrder: row.display_order,
      imageUrl: row.image_url,
      imageThumbnailUrl: row.image_thumbnail_url,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
    
    return {
      data: categoriesList,
      meta: {
        pagination: {
          page,
          pageSize,
          pageCount: Math.ceil(totalCount / pageSize),
          total: totalCount
        }
      }
    };
  } catch (error) {
    console.error("Error in getAllCategories:", error);
    throw error;
  }
}

export async function getCategoryById(id: number) {
  try {
    // Get category details
    const categoryQuery = `
      SELECT *
      FROM categories
      WHERE id = ${id}
    `;
    
    const categoryResult = await db.execute(categoryQuery);
    
    if (categoryResult.rows.length === 0) {
      return null;
    }
    
    const category = categoryResult.rows[0];
    
    // Get associated products count
    const productsCountQuery = `
      SELECT COUNT(*) as count
      FROM products
      WHERE category_id = ${id} AND is_active = true
    `;
    
    const productsCountResult = await db.execute(productsCountQuery);
    const productsCount = Number(productsCountResult.rows[0]?.count || 0);
    
    // Format response
    return {
      id: category.id,
      documentId: category.document_id,
      name: category.name,
      description: category.description,
      isActive: category.is_active,
      displayOrder: category.display_order,
      imageUrl: category.image_url,
      imageThumbnailUrl: category.image_thumbnail_url,
      createdAt: category.created_at,
      updatedAt: category.updated_at,
      productsCount: productsCount
    };
  } catch (error) {
    console.error("Error in getCategoryById:", error);
    throw error;
  }
}

export async function createNewCategory(categoryData: any) {
  try {
    // Generate document ID if not provided
    const documentId = categoryData.documentId || crypto.randomUUID().replace(/-/g, '');
    
    const insertCategoryQuery = `
      INSERT INTO categories (
        document_id, name, description, is_active,
        display_order, image_url, image_thumbnail_url,
        created_at, updated_at
      )
      VALUES (
        '${documentId}',
        '${categoryData.name}',
        '${categoryData.description || ''}',
        ${categoryData.isActive !== undefined ? categoryData.isActive : true},
        ${categoryData.displayOrder || 0},
        ${categoryData.imageUrl ? `'${categoryData.imageUrl}'` : 'NULL'},
        ${categoryData.imageThumbnailUrl ? `'${categoryData.imageThumbnailUrl}'` : 'NULL'},
        NOW(),
        NOW()
      )
      RETURNING *
    `;
    
    const insertResult = await db.execute(insertCategoryQuery);
    const insertedCategory = insertResult.rows[0];
    
    // Format response
    return {
      id: insertedCategory.id,
      documentId: insertedCategory.document_id,
      name: insertedCategory.name,
      description: insertedCategory.description,
      isActive: insertedCategory.is_active,
      displayOrder: insertedCategory.display_order,
      imageUrl: insertedCategory.image_url,
      imageThumbnailUrl: insertedCategory.image_thumbnail_url,
      createdAt: insertedCategory.created_at,
      updatedAt: insertedCategory.updated_at
    };
  } catch (error) {
    console.error("Error in createNewCategory:", error);
    throw error;
  }
}

export async function updateExistingCategory(id: number, categoryData: any) {
  try {
    // Build update query dynamically to avoid updating fields that weren't provided
    const updateFields = [];
    
    if (categoryData.name !== undefined) {
      updateFields.push(`name = '${categoryData.name}'`);
    }
    
    if (categoryData.description !== undefined) {
      updateFields.push(`description = '${categoryData.description}'`);
    }
    
    if (categoryData.isActive !== undefined) {
      updateFields.push(`is_active = ${categoryData.isActive}`);
    }
    
    if (categoryData.displayOrder !== undefined) {
      updateFields.push(`display_order = ${categoryData.displayOrder}`);
    }
    
    if (categoryData.imageUrl !== undefined) {
      updateFields.push(`image_url = ${categoryData.imageUrl ? `'${categoryData.imageUrl}'` : 'NULL'}`);
    }
    
    if (categoryData.imageThumbnailUrl !== undefined) {
      updateFields.push(`image_thumbnail_url = ${categoryData.imageThumbnailUrl ? `'${categoryData.imageThumbnailUrl}'` : 'NULL'}`);
    }
    
    // Always update the updated_at timestamp
    updateFields.push(`updated_at = NOW()`);
    
    if (updateFields.length === 0) {
      throw new Error('No fields to update');
    }
    
    const updateCategoryQuery = `
      UPDATE categories
      SET ${updateFields.join(', ')}
      WHERE id = ${id}
      RETURNING *
    `;
    
    const updateResult = await db.execute(updateCategoryQuery);
    
    if (updateResult.rows.length === 0) {
      return null;
    }
    
    const updatedCategory = updateResult.rows[0];
    
    // Format response
    return {
      id: updatedCategory.id,
      documentId: updatedCategory.document_id,
      name: updatedCategory.name,
      description: updatedCategory.description,
      isActive: updatedCategory.is_active,
      displayOrder: updatedCategory.display_order,
      imageUrl: updatedCategory.image_url,
      imageThumbnailUrl: updatedCategory.image_thumbnail_url,
      createdAt: updatedCategory.created_at,
      updatedAt: updatedCategory.updated_at
    };
  } catch (error) {
    console.error("Error in updateExistingCategory:", error);
    throw error;
  }
}

export async function deleteCategoryById(id: number) {
  try {
    // Begin transaction
    await db.execute('BEGIN');
    
    try {
      // Check if products exist in this category
      const productsInCategoryQuery = `
        SELECT COUNT(*) AS count
        FROM products
        WHERE category_id = ${id}
      `;
      
      const productsResult = await db.execute(productsInCategoryQuery);
      const productsCount = Number(productsResult.rows[0]?.count || 0);
      
      if (productsCount > 0) {
        // Can't delete a category with products
        await db.execute('ROLLBACK');
        throw new Error('Cannot delete category with associated products');
      }
      
      // Delete the category
      const deleteCategoryQuery = `
        DELETE FROM categories
        WHERE id = ${id}
        RETURNING *
      `;
      
      const deleteResult = await db.execute(deleteCategoryQuery);
      
      if (deleteResult.rows.length === 0) {
        await db.execute('ROLLBACK');
        return null;
      }
      
      const deletedCategory = deleteResult.rows[0];
      
      await db.execute('COMMIT');
      
      // Format response
      return {
        id: deletedCategory.id,
        documentId: deletedCategory.document_id,
        name: deletedCategory.name,
        description: deletedCategory.description,
        isActive: deletedCategory.is_active,
        displayOrder: deletedCategory.display_order,
        imageUrl: deletedCategory.image_url,
        imageThumbnailUrl: deletedCategory.image_thumbnail_url,
        createdAt: deletedCategory.created_at,
        updatedAt: deletedCategory.updated_at
      };
    } catch (error) {
      await db.execute('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteCategoryById:", error);
    throw error;
  }
}