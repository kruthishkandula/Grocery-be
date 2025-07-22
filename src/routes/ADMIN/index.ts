// const express = require("express");
// const router = express.Router();
// const service = require("./service");
import express from "express";
import { getCount, getDashboard } from "./service";

const router = express.Router();

router.get('/users/count', getCount)
router.get('/dashboard', getDashboard)
// router.post('/orders/count', login)
// router.post('/products/count', login)

export {
    router as ADMIN
};


