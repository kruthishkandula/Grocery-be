// const express = require('express');
import express from "express";
import multer from "multer";
import { AUTH } from "./AUTH/index";
import { CART } from "./CART/index";
import { USERS } from "./USERS/index";
import { ADMIN } from "./ADMIN";
import { admin_authenticate, authenticate } from "../common/middleware";
import { ORDERS } from "./ORDERS";
import { PRODUCTS } from "./PRODUCTS";
import { CATEGORIES } from "./CATEGORIES";
import { UPLOADS } from "./UPLOADS/index";
const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// // Public route
// router.get('/public', (req, res) => {
//     res.send('This is a public endpoint.');
// });

// // Protected route
// router.get('/protected', authenticate, (req, res) => {
//     res.send('This endpoint is protected by authentication.');
// });

// // File upload route
// router.post('/upload', upload.single('file'), (req, res) => {
//     res.send('File uploaded successfully.');
// });

router.use("/auth", AUTH);
router.use("/admin", admin_authenticate, ADMIN);
router.use("/users", authenticate, USERS);
router.use("/cart", authenticate, CART);
router.use("/categories", authenticate, CATEGORIES);
router.use("/products", authenticate, PRODUCTS);
router.use("/orders", authenticate, ORDERS);
router.use("/uploads", authenticate, UPLOADS);

export { router as routes };
