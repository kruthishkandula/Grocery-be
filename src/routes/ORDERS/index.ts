import express from "express";
import { admin_authenticate, authenticate } from "../../common/middleware";
import { 
  createOrder, 
  createOrderQuote, 
  createPayment, 
  getOrders,
  getOrderDetails,
  updateOrderStatus,
  getAllOrders,
  getOrderDetailsAdmin,
  updateOrderStatusAdmin
} from "./service";

const router = express.Router();

// Regular user order routes
router.post("/createorder/quote", authenticate, createOrderQuote);
router.post("/createorder", authenticate, createOrder);
router.post("/getorders", authenticate, getOrders);
router.post("/order/details", authenticate, getOrderDetails);
router.post("/order/status", authenticate, updateOrderStatus);
router.post("/payment", authenticate, createPayment);

// Admin-only order routes
router.post("/admin/orders", admin_authenticate, getAllOrders);
router.post("/admin/order/details", admin_authenticate, getOrderDetailsAdmin);
router.post("/admin/order/status", admin_authenticate, updateOrderStatusAdmin);

export { router as ORDERS };
