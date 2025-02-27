const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  uid: { type: String, required: true, unique: true},
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }, 
  subcategory: { type: String, required: true },
  actualItem: { type: String, required: true },
  stock: { type: Number, required: true },
  rating: { type: Number, default: 0},
  numberOfRatings: { type: Number, default: 0}, 
  images: { type: [String], required: true }, // Array of image URLs
});

module.exports = mongoose.model("Product", ProductSchema);
