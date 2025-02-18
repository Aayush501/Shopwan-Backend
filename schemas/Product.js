const mongoose = require("mongoose");

// Defining the Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Product name is mandatory
      trim: true, // Removes leading/trailing spaces
    },
    description: {
      type: String,
      required: true, // Description is mandatory
      trim: true,
    },
    price: {
      type: Number,
      required: true, // Price is mandatory
      min: 0, // Ensures price is not negative
    },
    category: {
      type: String,
      required: true, // Category is mandatory
      trim: true,
    },
    stock: {
      type: Number,
      required: true, // Stock count is mandatory
      min: 0, // Ensures stock is not negative
      default: 0, // Default stock is 0
    },
    images: [
      {
        type: String, // Stores image URLs or file paths
        required: true, // At least one image is mandatory
      },
    ],
  },
  { timestamps: true } // Adds createdAt & updatedAt fields
);

// Creating the Product Model
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
