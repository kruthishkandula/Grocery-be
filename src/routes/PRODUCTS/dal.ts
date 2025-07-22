import { db } from "../../config/db";
import { sql } from "drizzle-orm";
import crypto from 'crypto';

type PaginationParams = {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  searchValue?: string;
  priceMin?: number;
  priceMax?: number;
  categoryId?: number;
  isActive?: boolean;
};

export async function getAllProducts({ 
  page = 1, 
  pageSize = 10, 
  sortBy = 'updated_at', 
  sortOrder = 'desc',
  searchValue = '',
  priceMin,
  priceMax,
  categoryId,
  isActive
}: PaginationParams) {
  try {
    // Build WHERE conditions
    const conditions = [];
    
    if (searchValue) {
      conditions.push(`(name ILIKE '%${searchValue}%' OR description ILIKE '%${searchValue}%')`);
    }
    
    if (priceMin !== undefined) {
      conditions.push(`discount_price >= ${priceMin}`);
    }
    
    if (priceMax !== undefined) {
      conditions.push(`discount_price <= ${priceMax}`);
    }
    
    if (categoryId !== undefined) {
      conditions.push(`category_id = ${categoryId}`);
    }
    
    if (isActive !== undefined) {
      conditions.push(`is_active = ${isActive}`);
    }
    
    // Default to active products if no filters
    if (conditions.length === 0) {
      conditions.push('is_active = true');
    }
    
    const whereClause = `WHERE ${conditions.join(' AND ')}`;
    
    // Map sortBy to database column name
    const sortByMap: Record<string, string> = {
      'updatedAt': 'updated_at',
      'createdAt': 'created_at',
      'name': 'name',
      'basePrice': 'base_price',
      'discountPrice': 'discount_price'
    };
    
    const dbSortBy = sortByMap[sortBy] || 'updated_at';
    
    // Get total count for pagination - FIXED QUERY
    const countQuery = `SELECT COUNT(*) AS total FROM products ${whereClause}`;
    
    // Execute the query directly without using sql template literal
    const countResult = await db.execute(countQuery);
    const totalCount = Number(countResult.rows[0]?.total || 0);
    
    // Calculate offset
    const offset = (page - 1) * pageSize;
    
    // Get products with pagination - FIXED QUERY
    const productsQuery = `
      SELECT 
        id, document_id, name, description, short_description,
        base_price, discount_price, cost_price, weight_unit,
        is_active, currency, currency_symbol, barcode, brand,
        category_id, created_at, updated_at
      FROM products
      ${whereClause}
      ORDER BY ${dbSortBy} ${sortOrder.toUpperCase()}
      LIMIT ${pageSize} OFFSET ${offset}
    `;
    
    // Execute the query directly without using sql template literal
    const productsResult = await db.execute(productsQuery);
    
    // Format products
    const productsList = productsResult.rows.map(row => ({
      id: row.id,
      documentId: row.document_id,
      name: row.name,
      description: row.description,
      shortDescription: row.short_description,
      basePrice: row.base_price,
      discountPrice: row.discount_price,
      costPrice: row.cost_price,
      weightUnit: row.weight_unit,
      isActive: row.is_active,
      currency: row.currency,
      currencySymbol: row.currency_symbol,
      barcode: row.barcode,
      brand: row.brand,
      categoryId: row.category_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
    
    // Apply the same fix to all other SQL queries in this function
    const productsWithImagesAndVariants = await Promise.all(
      productsList.map(async (product) => {
        // Get images - FIXED QUERY
        const imagesQuery = `
          SELECT id, url, thumbnail_url, display_order
          FROM product_images
          WHERE product_id = ${product.id}
          ORDER BY display_order ASC
        `;
        
        const imagesResult = await db.execute(imagesQuery);
        const images = imagesResult.rows.map(row => ({
          id: row.id,
          url: row.url,
          thumbnailUrl: row.thumbnail_url,
          displayOrder: row.display_order
        }));
        
        // Get variants - FIXED QUERY
        const variantsQuery = `
          SELECT *
          FROM product_variants
          WHERE product_id = ${product.id}
        `;
        
        const variantsResult = await db.execute(variantsQuery);
        const variants = variantsResult.rows.map(row => ({
          id: row.id,
          productId: row.product_id,
          documentId: row.document_id,
          name: row.name,
          sku: row.sku,
          price: row.price,
          discountPrice: row.discount_price,
          stockQuantity: row.stock_quantity,
          weight: row.weight,
          weightUnit: row.weight_unit,
          isDefault: row.is_default,
          isActive: row.is_active,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }));
        
        return {
          ...product,
          images,
          variants
        };
      })
    );
    
    return {
      data: productsWithImagesAndVariants,
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
    console.error("Error in getAllProducts:", error);
    throw error;
  }
}

export async function getProductById(id: number) {
  try {
    // Get product details
    const productQuery = `
      SELECT *
      FROM products
      WHERE id = ${id}
    `;
    
    // Execute the query directly without using sql template literal
    const productResult = await db.execute(productQuery);
    
    if (productResult.rows.length === 0) {
      return null;
    }
    
    const product = productResult.rows[0];
    
    // Get product images
    const imagesQuery = `
      SELECT id, url, thumbnail_url, display_order
      FROM product_images
      WHERE product_id = ${id}
      ORDER BY display_order ASC
    `;
    
    // Execute the query directly without using sql template literal
    const imagesResult = await db.execute(imagesQuery);
    
    // Get product variants
    const variantsQuery = `
      SELECT *
      FROM product_variants
      WHERE product_id = ${id}
    `;
    
    // Execute the query directly without using sql template literal
    const variantsResult = await db.execute(variantsQuery);
    
    // Get category
    const categoryQuery = `
      SELECT *
      FROM categories
      WHERE id = ${product.category_id}
      LIMIT 1
    `;
    
    // Execute the query directly without using sql template literal
    const categoryResult = await db.execute(categoryQuery);
    
    // Format response
    return {
      id: product.id,
      documentId: product.document_id,
      name: product.name,
      description: product.description,
      shortDescription: product.short_description,
      basePrice: product.base_price,
      discountPrice: product.discount_price,
      costPrice: product.cost_price,
      weightUnit: product.weight_unit,
      isActive: product.is_active,
      currency: product.currency,
      currencySymbol: product.currency_symbol,
      barcode: product.barcode,
      brand: product.brand,
      categoryId: product.category_id,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
      publishedAt: product.published_at,
      images: imagesResult.rows.map(row => ({
        id: row.id,
        url: row.url,
        thumbnailUrl: row.thumbnail_url,
        displayOrder: row.display_order
      })),
      variants: variantsResult.rows.map(row => ({
        id: row.id,
        productId: row.product_id,
        documentId: row.document_id,
        name: row.name,
        sku: row.sku,
        price: row.price,
        discountPrice: row.discount_price,
        stockQuantity: row.stock_quantity,
        weight: row.weight,
        weightUnit: row.weight_unit,
        isDefault: row.is_default,
        isActive: row.is_active,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      })),
      category: categoryResult.rows.length > 0 ? {
        id: categoryResult.rows[0].id,
        name: categoryResult.rows[0].name,
        description: categoryResult.rows[0].description,
        isActive: categoryResult.rows[0].is_active,
        parentId: categoryResult.rows[0].parent_id,
        createdAt: categoryResult.rows[0].created_at,
        updatedAt: categoryResult.rows[0].updated_at
      } : null
    };
  } catch (error) {
    console.error("Error in getProductById:", error);
    throw error;
  }
}

export async function getProductsByCategory(categoryId: number, { 
  page = 1, 
  pageSize = 10, 
  sortBy = 'created_at', 
  sortOrder = 'desc'
}: PaginationParams) {
  try {
    // Calculate offset
    const offset = (page - 1) * pageSize;
    
    // Map sortBy to database column name
    const sortByMap: Record<string, string> = {
      'updatedAt': 'updated_at',
      'createdAt': 'created_at',
      'name': 'name',
      'basePrice': 'base_price',
      'discountPrice': 'discount_price'
    };
    
    const dbSortBy = sortByMap[sortBy] || 'created_at';
    
    // Get total count for pagination
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM products
      WHERE category_id = ${categoryId} AND is_active = true
    `;
    
    const countResult = await db.execute(countQuery);
    const totalCount = Number(countResult.rows[0]?.total || 0);
    
    // Get products
    const productsQuery = `
      SELECT *
      FROM products
      WHERE category_id = ${categoryId} AND is_active = true
      ORDER BY ${dbSortBy} ${sortOrder.toUpperCase()}
      LIMIT ${pageSize} OFFSET ${offset}
    `;
    
    const productsResult = await db.execute(productsQuery);
    
    // Format products
    const productsList = productsResult.rows.map(row => ({
      id: row.id,
      documentId: row.document_id,
      name: row.name,
      description: row.description,
      shortDescription: row.short_description,
      basePrice: row.base_price,
      discountPrice: row.discount_price,
      costPrice: row.cost_price,
      weightUnit: row.weight_unit,
      isActive: row.is_active,
      currency: row.currency,
      currencySymbol: row.currency_symbol,
      barcode: row.barcode,
      brand: row.brand,
      categoryId: row.category_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
    
    // Get product images and variants
    const productsWithImagesAndVariants = await Promise.all(
      productsList.map(async (product) => {
        // Get images
        const imagesQuery = `
          SELECT id, url, thumbnail_url, display_order
          FROM product_images
          WHERE product_id = ${product.id}
          ORDER BY display_order ASC
        `;
        
        const imagesResult = await db.execute(imagesQuery);
        const images = imagesResult.rows.map(row => ({
          id: row.id,
          url: row.url,
          thumbnailUrl: row.thumbnail_url,
          displayOrder: row.display_order
        }));
        
        // Get variants
        const variantsQuery = `
          SELECT *
          FROM product_variants
          WHERE product_id = ${product.id}
        `;
        
        const variantsResult = await db.execute(variantsQuery);
        const variants = variantsResult.rows.map(row => ({
          id: row.id,
          productId: row.product_id,
          documentId: row.document_id,
          name: row.name,
          sku: row.sku,
          price: row.price,
          discountPrice: row.discount_price,
          stockQuantity: row.stock_quantity,
          weight: row.weight,
          weightUnit: row.weight_unit,
          isDefault: row.is_default,
          isActive: row.is_active,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }));
        
        return {
          ...product,
          images,
          variants
        };
      })
    );
    
    return {
      data: productsWithImagesAndVariants,
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
    console.error("Error in getProductsByCategory:", error);
    throw error;
  }
}

export async function createNewProduct(productData: any) {
  try {
    // Begin transaction
    await db.execute('BEGIN');
    
    try {
      // Insert product
      const insertProductQuery = `
        INSERT INTO products (
          document_id, name, description, short_description, 
          base_price, discount_price, cost_price, weight_unit,
          is_active, currency, currency_symbol, barcode, brand,
          category_id, created_at, updated_at, published_at
        )
        VALUES (
          '${productData.documentId || crypto.randomUUID().replace(/-/g, '')}',
          '${productData.name}',
          '${productData.description}',
          '${productData.shortDescription}',
          ${productData.basePrice},
          ${productData.discountPrice},
          ${productData.costPrice},
          '${productData.weightUnit}',
          ${productData.isActive !== undefined ? productData.isActive : true},
          '${productData.currency || 'INR'}',
          '${productData.currencySymbol || '₹'}',
          ${productData.barcode ? `'${productData.barcode}'` : 'NULL'},
          ${productData.brand ? `'${productData.brand}'` : 'NULL'},
          ${productData.categoryId},
          NOW(),
          NOW(),
          NOW()
        )
        RETURNING *
      `;
      
      const insertProductResult = await db.execute(insertProductQuery);
      const insertedProduct = insertProductResult.rows[0];
      
      // Insert product images if provided
      if (productData.images && productData.images.length > 0) {
        for (let i = 0; i < productData.images.length; i++) {
          const image = productData.images[i];
          const insertImageQuery = `
            INSERT INTO product_images (
              product_id, url, thumbnail_url, display_order
            )
            VALUES (
              ${insertedProduct.id},
              '${image.url}',
              ${image.thumbnailUrl ? `'${image.thumbnailUrl}'` : 'NULL'},
              ${i}
            )
          `;
          
          await db.execute(insertImageQuery);
        }
      }
      
      // Insert product variants if provided
      if (productData.variants && productData.variants.length > 0) {
        for (const variant of productData.variants) {
          const variantDocumentId = variant.documentId || crypto.randomUUID().replace(/-/g, '');
          const isDefault = variant.isDefault !== undefined ? variant.isDefault : false;
          const variantIsActive = variant.isActive !== undefined ? variant.isActive : true;
          
          const insertVariantQuery = `
            INSERT INTO product_variants (
              product_id, document_id, name, sku, price, 
              discount_price, stock_quantity, weight, weight_unit,
              is_default, is_active, created_at, updated_at
            )
            VALUES (
              ${insertedProduct.id},
              '${variantDocumentId}',
              '${variant.name}',
              ${variant.sku ? `'${variant.sku}'` : 'NULL'},
              ${variant.price},
              ${variant.discountPrice},
              ${variant.stockQuantity || 0},
              ${variant.weight ? variant.weight : 'NULL'},
              ${variant.weightUnit ? `'${variant.weightUnit}'` : 'NULL'},
              ${isDefault},
              ${variantIsActive},
              NOW(),
              NOW()
            )
          `;
          
          await db.execute(insertVariantQuery);
        }
      }
      
      await db.execute('COMMIT');
      
      // Format response
      return {
        id: insertedProduct.id,
        documentId: insertedProduct.document_id,
        name: insertedProduct.name,
        description: insertedProduct.description,
        shortDescription: insertedProduct.short_description,
        basePrice: insertedProduct.base_price,
        discountPrice: insertedProduct.discount_price,
        costPrice: insertedProduct.cost_price,
        weightUnit: insertedProduct.weight_unit,
        isActive: insertedProduct.is_active,
        currency: insertedProduct.currency,
        currencySymbol: insertedProduct.currency_symbol,
        barcode: insertedProduct.barcode,
        brand: insertedProduct.brand,
        categoryId: insertedProduct.category_id,
        createdAt: insertedProduct.created_at,
        updatedAt: insertedProduct.updated_at,
        publishedAt: insertedProduct.published_at
      };
    } catch (error) {
      await db.execute('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error("Error in createNewProduct:", error);
    throw error;
  }
}

export async function updateExistingProduct(id: number, productData: any) {
  try {
    // Begin transaction
    await db.execute('BEGIN');
    
    try {
      // Update product
      const updateProductQuery = `
        UPDATE products
        SET 
          name = '${productData.name}',
          description = '${productData.description}',
          short_description = '${productData.shortDescription}',
          base_price = ${productData.basePrice},
          discount_price = ${productData.discountPrice},
          cost_price = ${productData.costPrice},
          weight_unit = '${productData.weightUnit}',
          is_active = ${productData.isActive},
          currency = '${productData.currency}',
          currency_symbol = '${productData.currencySymbol}',
          barcode = ${productData.barcode ? `'${productData.barcode}'` : 'NULL'},
          brand = ${productData.brand ? `'${productData.brand}'` : 'NULL'},
          category_id = ${productData.categoryId},
          updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
      
      const updateProductResult = await db.execute(updateProductQuery);
      const updatedProduct = updateProductResult.rows[0];
      
      // Update images if provided
      if (productData.images !== undefined) {
        // Delete existing images
        await db.execute(`DELETE FROM product_images WHERE product_id = ${id}`);
        
        // Insert new images
        if (productData.images && productData.images.length > 0) {
          for (let i = 0; i < productData.images.length; i++) {
            const image = productData.images[i];
            const insertImageQuery = `
              INSERT INTO product_images (
                product_id, url, thumbnail_url, display_order
              )
              VALUES (
                ${id},
                '${image.url}',
                ${image.thumbnailUrl ? `'${image.thumbnailUrl}'` : 'NULL'},
                ${i}
              )
            `;
            
            await db.execute(insertImageQuery);
          }
        }
      }
      
      // Update variants if provided
      if (productData.variants !== undefined) {
        // Delete existing variants
        await db.execute(`DELETE FROM product_variants WHERE product_id = ${id}`);
        
        // Insert new variants
        if (productData.variants && productData.variants.length > 0) {
          for (const variant of productData.variants) {
            const variantDocumentId = variant.documentId || crypto.randomUUID().replace(/-/g, '');
            const isDefault = variant.isDefault !== undefined ? variant.isDefault : false;
            const variantIsActive = variant.isActive !== undefined ? variant.isActive : true;
            
            const insertVariantQuery = `
              INSERT INTO product_variants (
                product_id, document_id, name, sku, price, 
                discount_price, stock_quantity, weight, weight_unit,
                is_default, is_active, created_at, updated_at
              )
              VALUES (
                ${id},
                '${variantDocumentId}',
                '${variant.name}',
                ${variant.sku ? `'${variant.sku}'` : 'NULL'},
                ${variant.price},
                ${variant.discountPrice},
                ${variant.stockQuantity || 0},
                ${variant.weight ? variant.weight : 'NULL'},
                ${variant.weightUnit ? `'${variant.weightUnit}'` : 'NULL'},
                ${isDefault},
                ${variantIsActive},
                NOW(),
                NOW()
              )
            `;
            
            await db.execute(insertVariantQuery);
          }
        }
      }
      
      await db.execute('COMMIT');
      
      // Format response
      return {
        id: updatedProduct.id,
        documentId: updatedProduct.document_id,
        name: updatedProduct.name,
        description: updatedProduct.description,
        shortDescription: updatedProduct.short_description,
        basePrice: updatedProduct.base_price,
        discountPrice: updatedProduct.discount_price,
        costPrice: updatedProduct.cost_price,
        weightUnit: updatedProduct.weight_unit,
        isActive: updatedProduct.is_active,
        currency: updatedProduct.currency,
        currencySymbol: updatedProduct.currency_symbol,
        barcode: updatedProduct.barcode,
        brand: updatedProduct.brand,
        categoryId: updatedProduct.category_id,
        createdAt: updatedProduct.created_at,
        updatedAt: updatedProduct.updated_at
      };
    } catch (error) {
      await db.execute('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error("Error in updateExistingProduct:", error);
    throw error;
  }
}

export async function deleteProductById(id: number) {
  try {
    // Begin transaction
    await db.execute('BEGIN');
    
    try {
      // First check if the product is referenced in order_items
      const checkOrderItemsQuery = `
        SELECT COUNT(*) AS count
        FROM order_items
        WHERE product_id = ${id}
      `;
      
      const orderItemsResult = await db.execute(checkOrderItemsQuery);
      const orderItemsCount = Number(orderItemsResult.rows[0]?.count || 0);
      
      if (orderItemsCount > 0) {
        // Product is referenced in orders - soft delete instead of hard delete
        const softDeleteQuery = `
          UPDATE products
          SET is_active = false, 
              updated_at = NOW()
          WHERE id = ${id}
          RETURNING *
        `;
        
        const softDeleteResult = await db.execute(softDeleteQuery);
        const softDeletedProduct = softDeleteResult.rows[0];
        
        await db.execute('COMMIT');
        
        return {
          ...softDeletedProduct,
          _softDeleted: true // Add flag to indicate this was a soft delete
        };
      }
      
      // If not referenced in orders, proceed with hard delete
      
      // Delete product images
      await db.execute(`DELETE FROM product_images WHERE product_id = ${id}`);
      
      // Delete product variants
      await db.execute(`DELETE FROM product_variants WHERE product_id = ${id}`);
      
      // Delete the product
      const deleteProductQuery = `
        DELETE FROM products
        WHERE id = ${id}
        RETURNING *
      `;
      
      const deleteResult = await db.execute(deleteProductQuery);
      const deletedProduct = deleteResult.rows[0];
      
      await db.execute('COMMIT');
      
      return deletedProduct;
    } catch (error) {
      await db.execute('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error("Error in deleteProductById:", error);
    throw error;
  }
}