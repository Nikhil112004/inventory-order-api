const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [1, "Description must be at least 1 characters"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },

    stockQuantity: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [0, "Stock quantity cannot be negative"],
      validate: {
        validator: Number.isInteger,
        message: "Stock quantity must be an integer",
      },
    },

    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);
productSchema.index({ category: 1, createdAt: -1 });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;