// const { ENV } = require("../../config/env");

import { sql } from "drizzle-orm";
import { _sendResponse } from "../../common/common";
import { categories, orders, products, users } from "../../common/db/migrations/schema";
import { cmsApi } from "../../config/axios";
import { db } from "../../config/db";
import { cms_urls } from "../../constants/urls";
import { getAllProducts } from "../PRODUCTS/dal";
import { getAllCategories } from "../CATEGORIES/dal";


export const getCount = async (req: any, res: any) => {

  try {
    const user_count = await db.$count(users)

    if (!user_count) {
      return _sendResponse({
        req,
        res,
        statusCode: 200,
        title: "FAILURE",
        message: 'FAILED_TO_FETCH_COUNT'
      });
    }


    return res.status(200).json({
      user_count,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getDashboard = async (req: any, res: any) => {
  try {
    // Query 1: Get all counts and latest products in a single query
    const dashboardQuery = await db.execute(sql`
      WITH counts AS (
        SELECT 
          (SELECT COUNT(*) FROM users) AS user_count,
          (SELECT COUNT(*) FROM orders) AS orders_count,
          (SELECT COUNT(*) FROM products) AS products_count,
          (SELECT COUNT(*) FROM products WHERE is_active = true) AS active_products_count,
          (SELECT COUNT(*) FROM categories) AS categories_count,
          (SELECT COUNT(*) FROM categories WHERE is_active = true) AS active_categories_count
      ),
      latest_products AS (
        SELECT 
          p.id, 
          p.name, 
          p.short_description, 
          p.base_price, 
          p.discount_price, 
          p.is_active,
          p.updated_at,
          c.name AS category_name,
          (
            SELECT json_build_object(
              'url', pi.url,
              'thumbnail_url', pi.thumbnail_url
            )
            FROM product_images pi
            WHERE pi.product_id = p.id 
            ORDER BY pi.display_order ASC 
            LIMIT 1
          ) AS image
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.updated_at DESC
        LIMIT 10
      )
      SELECT 
        (SELECT row_to_json(counts) FROM counts) AS counts,
        COALESCE(json_agg(latest_products), '[]'::json) AS products
      FROM latest_products
    `);
    
    // Query 2: Get latest categories with aggregate data
    const categoriesQuery = await db.execute(sql`
      SELECT json_agg(
        json_build_object(
          'id', c.id,
          'name', c.name,
          'description', c.description,
          'isActive', c.is_active,
          'displayOrder', c.display_order,
          'imageUrl', c.image_url,
          'imageThumbnailUrl', c.image_thumbnail_url,
          'updatedAt', c.updated_at,
          'productCount', (
            SELECT COUNT(*) 
            FROM products 
            WHERE category_id = c.id
          )
        )
      ) AS categories
      FROM (
        SELECT * 
        FROM categories 
        ORDER BY updated_at DESC 
        LIMIT 10
      ) c
    `);
    
    // Extract data from query results
    const counts = dashboardQuery.rows[0]?.counts || {
      user_count: 0,
      orders_count: 0,
      products_count: 0,
      active_products_count: 0,
      categories_count: 0,
      active_categories_count: 0
    };
    
    const few_products = dashboardQuery.rows[0]?.products || [];
    const few_categories = categoriesQuery.rows[0]?.categories || [];

    return _sendResponse({
      req,
      res,
      statusCode: 200,
      title: "SUCCESS",
      message: 'FETCHED_DASHBOARD_DATA',
      result: {
        user_count: parseInt(counts.user_count),
        orders_count: parseInt(counts.orders_count),
        products_count: parseInt(counts.products_count),
        categories_count: parseInt(counts.categories_count),
        active_products_count: parseInt(counts.active_products_count),
        active_categories_count: parseInt(counts.active_categories_count),
        data: {
          few_products,
          few_categories,
        }
      }
    });
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return _sendResponse({
      req,
      res,
      statusCode: 500,
      title: "FAILURE",
      message: 'FAILED_TO_FETCH_DASHBOARD_DATA',
    });
  }
};
