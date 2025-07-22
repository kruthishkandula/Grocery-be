import { sql } from "drizzle-orm";
import { db } from "../../config/db";
import { paymentStatus } from "../../common/db/migrations/schema";

export async function getOrdersByUserId(userId: string) {
  try {
    // Check if user has any orders
    const countResult = await db.execute(sql`
      SELECT COUNT(*) as count
      FROM orders 
      WHERE user_id = ${userId}
    `);
    
    const count = Number(countResult.rows[0]?.count || 0);
    if (count === 0) {
      return []; // Return empty array if no orders found
    }
    
    // Get orders
    const ordersResult = await db.execute(sql`
      SELECT 
        order_id, 
        user_id,
        total_amount,
        delivery_address,
        quote_details,
        payment_id,
        status,
        created_at, 
        updated_at
      FROM orders
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `);
    
    // Process orders and fetch related data
    const ordersWithDetails = await Promise.all(ordersResult.rows.map(async (order) => {
      try {
        // Get order items with product info
        const orderItemsResult = await db.execute(sql`
          SELECT 
            oi.id as item_id,
            oi.product_id,
            oi.product_variant_id,
            oi.quantity,
            oi.unit_price,
            oi.total_price,
            oi.product_snapshot,
            p.name as product_name,
            p.short_description,
            pv.name as variant_name,
            (
              SELECT url 
              FROM product_images 
              WHERE product_id = oi.product_id 
              ORDER BY display_order ASC 
              LIMIT 1
            ) as image_url
          FROM order_items oi
          LEFT JOIN products p ON oi.product_id = p.id
          LEFT JOIN product_variants pv ON oi.product_variant_id = pv.id
          WHERE oi.order_id = ${order.order_id}
          ORDER BY oi.id ASC
        `);
        
        // Get payment details
        let payment = null;
        if (order.payment_id) {
          const paymentResult = await db.execute(sql`
            SELECT 
              id, 
              payment_id, 
              amount, 
              status, 
              created_at
            FROM payments
            WHERE payment_id = ${order.payment_id}
          `);
          
          if (paymentResult.rows.length > 0) {
            payment = paymentResult.rows[0];
          }
        }
        
        return {
          orderId: order.order_id,
          userId: order.user_id,
          totalAmount: order.total_amount,
          deliveryAddress: order.delivery_address,
          quoteDetails: typeof order.quote_details === 'string' 
            ? JSON.parse(order.quote_details) 
            : order.quote_details,
          status: order.status,
          paymentId: order.payment_id,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
          items: orderItemsResult.rows,
          payment
        };
      } catch (error) {
        console.error(`Error fetching details for order ${order.order_id}:`, error);
        return {
          orderId: order.order_id,
          userId: order.user_id,
          totalAmount: order.total_amount,
          deliveryAddress: order.delivery_address,
          quoteDetails: typeof order.quote_details === 'string' 
            ? JSON.parse(order.quote_details) 
            : order.quote_details,
          status: order.status,
          paymentId: order.payment_id,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
          items: [],
          payment: null
        };
      }
    }));
    
    return ordersWithDetails;
  } catch (error) {
    console.error("Error in getOrdersByUserId:", error);
    throw error;
  }
}

export async function getOrderById(orderId: string) {
  try {
    // Get order details
    const orderResult = await db.execute(sql`
      SELECT 
        order_id, 
        user_id,
        total_amount,
        delivery_address,
        quote_details,
        payment_id,
        status,
        created_at, 
        updated_at
      FROM orders
      WHERE order_id = ${orderId}
    `);
    
    if (orderResult.rows.length === 0) {
      return null;
    }
    
    const order = orderResult.rows[0];
    
    // Get order items with product info
    const orderItemsResult = await db.execute(sql`
      SELECT 
        oi.id as item_id,
        oi.product_id,
        oi.product_variant_id,
        oi.quantity,
        oi.unit_price,
        oi.total_price,
        oi.product_snapshot,
        p.name as product_name,
        p.short_description,
        pv.name as variant_name,
        (
          SELECT url 
          FROM product_images 
          WHERE product_id = oi.product_id 
          ORDER BY display_order ASC 
          LIMIT 1
        ) as image_url
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN product_variants pv ON oi.product_variant_id = pv.id
      WHERE oi.order_id = ${orderId}
      ORDER BY oi.id ASC
    `);
    
    // Get payment details
    let payment = null;
    if (order.payment_id) {
      const paymentResult = await db.execute(sql`
        SELECT 
          id, 
          payment_id, 
          amount, 
          status, 
          created_at
        FROM payments
        WHERE payment_id = ${order.payment_id}
      `);
      
      if (paymentResult.rows.length > 0) {
        payment = paymentResult.rows[0];
      }
    }
    
    // Get user details
    let user = null;
    if (order.user_id) {
      const userResult = await db.execute(sql`
        SELECT 
          id, 
          username as name, 
          email, 
          phonenumber as phone
        FROM users
        WHERE user_id = ${order.user_id}
      `);
      
      if (userResult.rows.length > 0) {
        user = userResult.rows[0];
      }
    }
    
    return {
      orderId: order.order_id,
      userId: order.user_id,
      totalAmount: order.total_amount,
      deliveryAddress: order.delivery_address,
      quoteDetails: typeof order.quote_details === 'string' 
        ? JSON.parse(order.quote_details) 
        : order.quote_details,
      status: order.status,
      paymentId: order.payment_id,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
      items: orderItemsResult.rows,
      payment,
      user
    };
  } catch (error) {
    console.error("Error in getOrderById:", error);
    throw error;
  }
}

export async function createOrderRecord(orderData: any) {
  try {
    // Begin transaction
    await db.execute(sql`BEGIN`);
    
    try {
      // 1. Create the main order record
      const orderResult = await db.execute(sql`
        INSERT INTO orders (
          order_id,
          user_id,
          total_amount,
          delivery_address,
          quote_details,
          payment_id,
          status,
          created_at,
          updated_at
        ) VALUES (
          ${orderData.orderId},
          ${orderData.userId},
          ${orderData.totalPrice},
          ${orderData.deliveryAddress},
          ${JSON.stringify(orderData.quoteDetails)},
          ${orderData.paymentId},
          'confirmed',
          NOW(),
          NOW()
        )
        RETURNING *
      `);
      
      const newOrder = orderResult.rows[0];
      
      // 2. Create order items for each product
      const orderItems = [];
      for (const item of orderData.items) {
        const itemResult = await db.execute(sql`
          INSERT INTO order_items (
            order_id,
            product_id,
            product_variant_id,
            quantity,
            unit_price,
            total_amount,
            product_snapshot,
            created_at
          ) VALUES (
            ${orderData.orderId},
            ${item.productId},
            ${item.productVariantId || null},
            ${item.quantity},
            ${item.unitPrice},
            ${item.totalPrice},
            ${JSON.stringify(item.productSnapshot)},
            NOW()
          )
          RETURNING *
        `);
        
        orderItems.push(itemResult.rows[0]);
      }
      
      // Commit transaction
      await db.execute(sql`COMMIT`);
      
      return {
        ...newOrder,
        items: orderItems
      };
    } catch (error) {
      // Rollback transaction in case of error
      await db.execute(sql`ROLLBACK`);
      throw error;
    }
  } catch (error) {
    console.error("Error in createOrderRecord:", error);
    throw error;
  }
}

export async function createPaymentRecord(paymentData: any) {
  try {
    // Check the actual column name in the database
    const columnsQuery = await db.execute(sql`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'payments'
    `);
    
    console.log('Available columns in payments table:', columnsQuery.rows.map(r => r.column_name));
    
    // Create payment record - using only the fields we know exist
    const result = await db.execute(sql`
      INSERT INTO payments (
        user_id,
        payment_id,
        amount,
        status,
        created_at
      ) VALUES (
        ${paymentData.userId},
        ${paymentData.paymentId},
        ${paymentData.amount},
        ${paymentData.status || 'pending'},
        NOW()
      )
      RETURNING *
    `);
    
    return result.rows[0];
  } catch (error) {
    console.error("Error in createPaymentRecord:", error);
    throw error;
  }
}

export async function getPaymentById(paymentId: string) {
  try {
    const result = await db.execute(sql`
      SELECT *
      FROM payments
      WHERE payment_id = ${paymentId}
    `);
    
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Error in getPaymentById:", error);
    throw error;
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const result = await db.execute(sql`
      UPDATE orders
      SET 
        status = ${status},
        updated_at = NOW()
      WHERE order_id = ${orderId}
      RETURNING *
    `);
    
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    throw error;
  }
}

// Get all orders for admin
export async function getAllOrdersFromDb({ 
  page = 1, 
  pageSize = 10, 
  sortBy = 'created_at', 
  sortOrder = 'desc',
  status = null 
}) {
  try {
    // Build the base query
    let countQuery = `
      SELECT COUNT(*) as count
      FROM orders
    `;
    
    let ordersQuery = `
      SELECT 
        order_id, 
        user_id,
        total_amount,
        delivery_address,
        quote_details,
        payment_id,
        status,
        created_at, 
        updated_at
      FROM orders
    `;
    
    // Add WHERE clause for status filtering if provided
    const whereClause = status ? ` WHERE status = '${status}'` : '';
    countQuery += whereClause;
    ordersQuery += whereClause;
    
    // Add sorting and pagination
    ordersQuery += ` ORDER BY ${sortBy} ${sortOrder} LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`;
    
    // Execute count query
    const countResult = await db.execute(sql`${countQuery}`);
    const totalCount = Number(countResult.rows[0]?.count || 0);
    
    if (totalCount === 0) {
      return {
        data: [],
        meta: {
          pagination: {
            page,
            pageSize,
            pageCount: 0,
            total: 0
          }
        }
      };
    }
    
    // Execute orders query
    const ordersResult = await db.execute(sql`${ordersQuery}`);
    
    // Process orders and fetch related data
    const ordersWithDetails = await Promise.all(ordersResult.rows.map(async (order) => {
      try {
        // Get order items
        const orderItemsResult = await db.execute(sql`
          SELECT 
            oi.id as item_id,
            oi.product_id,
            oi.product_variant_id,
            oi.quantity,
            oi.unit_price,
            oi.total_price,
            oi.product_snapshot,
            p.name as product_name,
            p.short_description,
            pv.name as variant_name,
            (
              SELECT url 
              FROM product_images 
              WHERE product_id = oi.product_id 
              ORDER BY display_order ASC 
              LIMIT 1
            ) as image_url
          FROM order_items oi
          LEFT JOIN products p ON oi.product_id = p.id
          LEFT JOIN product_variants pv ON oi.product_variant_id = pv.id
          WHERE oi.order_id = ${order.order_id}
          ORDER BY oi.id ASC
        `);
        
        // Get user details
        let user = null;
        if (order.user_id) {
          const userResult = await db.execute(sql`
            SELECT 
              id, 
              user_id,
              username as name, 
              email, 
              phonenumber as phone
            FROM users
            WHERE user_id = ${order.user_id}
          `);
          
          if (userResult.rows.length > 0) {
            user = userResult.rows[0];
          }
        }
        
        // Get payment details
        let payment = null;
        if (order.payment_id) {
          const paymentResult = await db.execute(sql`
            SELECT 
              id, 
              payment_id, 
              amount, 
              status, 
              created_at
            FROM payments
            WHERE payment_id = ${order.payment_id}
          `);
          
          if (paymentResult.rows.length > 0) {
            payment = paymentResult.rows[0];
          }
        }
        
        return {
          orderId: order.order_id,
          userId: order.user_id,
          totalAmount: order.total_amount,
          deliveryAddress: order.delivery_address,
          quoteDetails: typeof order.quote_details === 'string' 
            ? JSON.parse(order.quote_details) 
            : order.quote_details,
          status: order.status,
          paymentId: order.payment_id,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
          items: orderItemsResult.rows,
          user,
          payment
        };
      } catch (error) {
        console.error(`Error fetching details for order ${order.order_id}:`, error);
        return {
          orderId: order.order_id,
          userId: order.user_id,
          totalAmount: order.total_amount,
          deliveryAddress: order.delivery_address,
          quoteDetails: typeof order.quote_details === 'string' 
            ? JSON.parse(order.quote_details) 
            : order.quote_details,
          status: order.status,
          paymentId: order.payment_id,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
          items: [],
          user: null,
          payment: null
        };
      }
    }));
    
    return {
      data: ordersWithDetails,
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
    console.error("Error in getAllOrdersFromDb:", error);
    throw error;
  }
}