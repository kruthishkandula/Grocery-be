import { _sendResponse } from "../../common/common";
import {
  createOrderRecord,
  createPaymentRecord,
  getOrderById,
  getOrdersByUserId,
  getPaymentById,
  updateOrderStatus as updateOrderStatusDAL,
  getAllOrdersFromDb,
} from "./dal";

// Calculate order quote for multiple items
export const createOrderQuote = async (req: any, res: any) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return _sendResponse({
        req,
        res,
        statusCode: 400,
        title: "FAILURE",
        message: "USER_ID_REQUIRED",
      });
    }

    if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0) {
      return _sendResponse({
        req,
        res,
        statusCode: 400,
        title: "FAILURE",
        message: "ITEMS_REQUIRED",
      });
    }

    // Calculate subtotal from all items
    let subtotal = 0;
    const itemsWithTotals = req.body.items.map(item => {
      if (!item.product_id || !item.unit_price || !item.quantity) {
        throw new Error("Each item must have product_id, unit_price, and quantity");
      }
      
      const itemTotal = parseFloat(item.unit_price) * Number(item.quantity);
      subtotal += itemTotal;
      
      return {
        ...item,
        total_price: itemTotal
      };
    });

    // Calculate delivery fee based on subtotal
    let calculated_delivery_fee = 0;
    switch (true) {
      case subtotal < 100:
        calculated_delivery_fee = 30;
        break;
      case subtotal >= 100 && subtotal < 500:
        calculated_delivery_fee = 15;
        break;
      case subtotal >= 500:
        calculated_delivery_fee = 0;
        break;
    }

    // Build quote details
    const quoteDetails = {
      subtotal: subtotal,
      deliver_fee: calculated_delivery_fee,
      surge_fee: parseFloat((subtotal * 0.01).toFixed(2)) || 0,
      sgst: 0,
      cgst: 0,
      coupon_discount: 0,
      items: itemsWithTotals
    };

    // Calculate total price
    quoteDetails.total_price = subtotal + quoteDetails.deliver_fee +
      quoteDetails.surge_fee + quoteDetails.sgst +
      quoteDetails.cgst - quoteDetails.coupon_discount;

    return _sendResponse({
      req,
      res,
      statusCode: 200,
      title: "SUCCESS",
      message: "ORDER_QUOTE_DETAILS_FETCHED",
      result: quoteDetails,
    });
  } catch (error: any) {
    console.error("Error generating order quote:", error);
    return _sendResponse({
      req,
      res,
      statusCode: 500,
      title: "ERROR",
      message: "QUOTE_GENERATION_FAILED",
      result: { error: error.message },
    });
  }
};

// Create payment for an order
export const createPayment = async (req: any, res: any) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return _sendResponse({
        req,
        res,
        statusCode: 400,
        title: "FAILURE",
        message: "USER_ID_REQUIRED",
      });
    }

    if (!req.body.quote_details?.total_price || !req.body.payment_method) {
      return _sendResponse({
        req,
        res,
        statusCode: 400,
        title: "FAILURE",
        message: "MISSING_REQUIRED_FIELDS",
      });
    }

    // Generate unique payment ID
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    const paymentId = `pay_${timestamp}${randomPart}`;
    const paymentStatus = req.body.payment_status || "pending";

    // Create a payment record
    const newPayment = await createPaymentRecord({
      userId: userId,
      paymentId: paymentId,
      amount: req.body.quote_details.total_price.toString(),
      paymentMethod: req.body.payment_method,
      status: paymentStatus
    });

    return _sendResponse({
      req,
      res,
      statusCode: 201,
      title: "SUCCESS",
      message: "PAYMENT_CREATED",
      result: {
        payment_id: paymentId,
        payment_type: req.body.payment_method,
        amount: req.body.quote_details.total_price,
        status: paymentStatus
      },
    });
  } catch (error: any) {
    console.error("Error creating payment:", error);
    return _sendResponse({
      req,
      res,
      statusCode: 500,
      title: "ERROR",
      message: "PAYMENT_CREATION_FAILED",
      result: { error: error.message },
    });
  }
};

// Create order with multiple items
export const createOrder = async (req: any, res: any) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return _sendResponse({
        req,
        res,
        statusCode: 400,
        title: "FAILURE",
        message: "USER_ID_REQUIRED",
      });
    }

    // Validate required fields
    if (!req.body.items || !Array.isArray(req.body.items) || req.body.items.length === 0 ||
        !req.body.delivery_address || !req.body.quote_details ||
        !req.body.payment_id) {
      return _sendResponse({
        req,
        res,
        statusCode: 400,
        title: "FAILURE",
        message: "MISSING_REQUIRED_FIELDS",
      });
    }

    // Verify payment exists and belongs to the user
    const payment = await getPaymentById(req.body.payment_id);

    if (!payment || payment.user_id !== userId) {
      return _sendResponse({
        req,
        res,
        statusCode: 404,
        title: "FAILURE",
        message: "PAYMENT_NOT_FOUND",
      });
    }


    console.log('payment----', payment, req.body.quote_details?.total_price)
    // Verify payment amount matches quote total
    if (payment.amount !== req.body.quote_details?.total_price.toString()) {
      return _sendResponse({
        req,
        res,
        statusCode: 400,
        title: "FAILURE",
        message: "PAYMENT_AMOUNT_MISMATCH",
      });
    }

    // Generate unique order ID
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    const orderId = `#order${timestamp}${randomPart}`;

    // Prepare order items
    const orderItems = req.body.items.map(item => ({
      productId: item.product_id,
      productVariantId: item.product_variant_id || null,
      quantity: item.quantity,
      unitPrice: item.unit_price,
      totalPrice: item.total_price,
      productSnapshot: item.product_snapshot
    }));

    // Create the order with items
    const newOrder = await createOrderRecord({
      orderId: orderId,
      userId: userId,
      totalPrice: req.body.quote_details.total_price, // This value will be inserted as total_amount
      deliveryAddress: req.body.delivery_address,
      quoteDetails: req.body.quote_details,
      paymentId: req.body.payment_id,
      items: orderItems
    });

    return _sendResponse({
      req,
      res,
      statusCode: 201,
      title: "SUCCESS",
      message: "ORDER_CREATED",
      result: {
        order_id: orderId,
        payment_id: req.body.payment_id,
        total_amount: req.body.quote_details.total_price,
        items_count: orderItems.length
      },
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return _sendResponse({
      req,
      res,
      statusCode: 500,
      title: "ERROR",
      message: "ORDER_CREATION_FAILED",
      result: { error: error.message },
    });
  }
};

// Get all orders for a user
export const getOrders = async (req: any, res: any) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return _sendResponse({
        req,
        res,
        statusCode: 400,
        title: "FAILURE",
        message: "USER_ID_REQUIRED",
      });
    }

    // Get orders with related data
    const ordersWithDetails = await getOrdersByUserId(userId);

    return _sendResponse({
      req,
      res,
      statusCode: 200,
      title: "SUCCESS",
      message: ordersWithDetails.length > 0
        ? "ORDER_DETAILS_FETCHED"
        : "NO_ORDERS_FOUND",
      result: ordersWithDetails,
    });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return _sendResponse({
      req,
      res,
      statusCode: 500,
      title: "ERROR",
      message: "ORDERS_FETCH_ERROR",
      result: { error: error.message },
    });
  }
};

// Get details of a specific order
export const getOrderDetails = async (req: any, res: any) => {
  try {
    const userId = req.user?.userId;
    const { order_id } = req.body;

    if (!userId) {
      return _sendResponse({
        req,
        res,
        statusCode: 400,
        title: "FAILURE",
        message: "USER_ID_REQUIRED",
      });
    }

    if (!order_id) {
      return _sendResponse({
        req,
        res,
        statusCode: 400,
        title: "FAILURE",
        message: "ORDER_ID_REQUIRED",
      });
    }

    // Get order with related data
    const orderWithDetails = await getOrderById(order_id);

    if (!orderWithDetails) {
      return _sendResponse({
        req,
        res,
        statusCode: 404,
        title: "FAILURE",
        message: "ORDER_NOT_FOUND",
      });
    }

    // Check if order belongs to user
    if (orderWithDetails.userId !== userId) {
      return _sendResponse({
        req,
        res,
        statusCode: 403,
        title: "FAILURE",
        message: "UNAUTHORIZED_ACCESS",
      });
    }

    return _sendResponse({
      req,
      res,
      statusCode: 200,
      title: "SUCCESS",
      message: "ORDER_DETAILS_FETCHED",
      result: orderWithDetails,
    });
  } catch (error: any) {
    console.error("Error fetching order details:", error);
    return _sendResponse({
      req,
      res,
      statusCode: 500,
      title: "ERROR",
      message: "ORDER_DETAILS_FETCH_ERROR",
      result: { error: error.message },
    });
  }
};

// Update order status
export const updateOrderStatus = async (req: any, res: any) => {
  try {
    const userId = req.user?.userId;
    const { order_id, status } = req.body;

    if (!userId) {
      return _sendResponse({
        req,
        res,
        statusCode: 400,
        title: "FAILURE",
        message: "USER_ID_REQUIRED",
      });
    }

    if (!order_id || !status) {
      return _sendResponse({
        req,
        res,
        statusCode: 400,
        title: "FAILURE",
        message: "ORDER_ID_AND_STATUS_REQUIRED",
      });
    }

    // Get order to check ownership
    const orderDetails = await getOrderById(order_id);

    if (!orderDetails) {
      return _sendResponse({
        req,
        res,
        statusCode: 404,
        title: "FAILURE",
        message: "ORDER_NOT_FOUND",
      });
    }

    // Check if order belongs to user
    if (orderDetails.userId !== userId) {
      return _sendResponse({
        req,
        res,
        statusCode: 403,
        title: "FAILURE",
        message: "UNAUTHORIZED_ACCESS",
      });
    }

    // Update order status
    const updatedOrder = await updateOrderStatusDAL(order_id, status);

    return _sendResponse({
      req,
      res,
      statusCode: 200,
      title: "SUCCESS",
      message: "ORDER_STATUS_UPDATED",
      result: updatedOrder,
    });
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return _sendResponse({
      req,
      res,
      statusCode: 500,
      title: "ERROR",
      message: "ORDER_STATUS_UPDATE_FAILED",
      result: { error: error.message },
    });
  }
};

// Admin: Get all orders
export const getAllOrders = async (req: any, res: any) => {
  try {
    const { 
      page = 1, 
      pageSize = 10, 
      sortBy = "created_at", 
      sortOrder = "desc",
      status = null
    } = req.body;
    
    // Get orders with admin privileges (all users)
    const allOrders = await getAllOrdersFromDb({
      page: Number(page),
      pageSize: Number(pageSize),
      sortBy: sortBy as string,
      sortOrder: (sortOrder as 'asc' | 'desc') || 'desc',
      status: status
    });

    return _sendResponse({
      req,
      res,
      statusCode: 200,
      title: "SUCCESS",
      message: "ALL_ORDERS_FETCHED",
      result: allOrders,
    });
  } catch (error: any) {
    console.error("Error fetching all orders:", error);
    return _sendResponse({
      req,
      res,
      statusCode: 500,
      title: "ERROR",
      message: "ORDERS_FETCH_ERROR",
      result: { error: error.message },
    });
  }
};

// Admin: Get order details
export const getOrderDetailsAdmin = async (req: any, res: any) => {
  try {
    const { order_id } = req.body;

    if (!order_id) {
      return _sendResponse({
        req,
        res,
        statusCode: 400,
        title: "FAILURE",
        message: "ORDER_ID_REQUIRED",
      });
    }

    // Get order with related data (no user check since admin)
    const orderWithDetails = await getOrderById(order_id);

    if (!orderWithDetails) {
      return _sendResponse({
        req,
        res,
        statusCode: 404,
        title: "FAILURE",
        message: "ORDER_NOT_FOUND",
      });
    }

    return _sendResponse({
      req,
      res,
      statusCode: 200,
      title: "SUCCESS",
      message: "ORDER_DETAILS_FETCHED",
      result: orderWithDetails,
    });
  } catch (error: any) {
    console.error("Error fetching order details:", error);
    return _sendResponse({
      req,
      res,
      statusCode: 500,
      title: "ERROR",
      message: "ORDER_DETAILS_FETCH_ERROR",
      result: { error: error.message },
    });
  }
};

// Admin: Update order status
export const updateOrderStatusAdmin = async (req: any, res: any) => {
  try {
    const { order_id, status } = req.body;

    if (!order_id || !status) {
      return _sendResponse({
        req,
        res,
        statusCode: 400,
        title: "FAILURE",
        message: "ORDER_ID_AND_STATUS_REQUIRED",
      });
    }

    // Get order to check it exists
    const orderDetails = await getOrderById(order_id);

    if (!orderDetails) {
      return _sendResponse({
        req,
        res,
        statusCode: 404,
        title: "FAILURE",
        message: "ORDER_NOT_FOUND",
      });
    }

    // Update order status (no user check since admin)
    const updatedOrder = await updateOrderStatusDAL(order_id, status);

    return _sendResponse({
      req,
      res,
      statusCode: 200,
      title: "SUCCESS",
      message: "ORDER_STATUS_UPDATED",
      result: updatedOrder,
    });
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return _sendResponse({
      req,
      res,
      statusCode: 500,
      title: "ERROR",
      message: "ORDER_STATUS_UPDATE_FAILED",
      result: { error: error.message },
    });
  }
};