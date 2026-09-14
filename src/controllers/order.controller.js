const Order = require("../models/Order");
const Product = require("../models/Product");

const createOrder = async (req, res, next) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products are required",
      });
    }

    let totalAmount = 0;
    const orderProducts = [];

    for (const item of products) {
      const { product: productId, quantity } = item;

      if (!productId || !Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Product and valid quantity are required",
        });
      }

      // Atomically check stock and reduce it
      const product = await Product.findOneAndUpdate(
        {
          _id: productId,
          stockQuantity: { $gte: quantity },
        },
        {
          $inc: {
            stockQuantity: -quantity,
          },
        },
        {
          new: true,
        },
      );

      if (!product) {
        return res.status(400).json({
          success: false,
          message: "Product not found or insufficient stock",
        });
      }

      totalAmount += product.price * quantity;

      orderProducts.push({
        product: product._id,
        quantity,
        price: product.price,
      });
    }

    const order = await Order.create({
      user: req.user,
      products: orderProducts,
      totalAmount,
      status: "confirmed",
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    next(error);
  }
};

const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({
      user: req.user,
    })
      .populate("products.product", "name category")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user,
    }).populate("products.product", "name category");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
};
