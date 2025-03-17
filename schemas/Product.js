const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  uid: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  actualItem: { type: String, required: true },
  stock: { type: Number, required: true },
  media: { type: [String], required: true }, // Store image/video URLs
});

module.exports = mongoose.model("Product", ProductSchema);
