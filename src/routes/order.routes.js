const express = require("express");

const {
  createOrder,
  getOrders,
  getOrder,
} = require("../controllers/order.controller");

const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, createOrder);

router.get("/", authMiddleware, getOrders);

router.get("/:id", authMiddleware, getOrder);

module.exports = router;