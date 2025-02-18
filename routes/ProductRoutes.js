const express = require("express");
const router = express.Router();
const Product = require("../schemas/Product");

// Helper function to fetch and sort products
const getProductsByCategory = async (category, order, res) => {
  try {
    const filter = category === "all" ? {} : { category }; // Fetch all or specific category
    const products = await Product.find(filter).sort({ price: order });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Route: Get Clothes in Ascending Order
router.get("/clothes/ascending", (req, res) => {
  getProductsByCategory("clothes", 1, res);
});

// Route: Get Clothes in Descending Order
router.get("/clothes/descending", (req, res) => {
  getProductsByCategory("clothes", -1, res);
});

// Route: Get Jewelleries in Ascending Order
router.get("/jewelleries/ascending", (req, res) => {
  getProductsByCategory("jewelleries", 1, res);
});

// Route: Get Jewelleries in Descending Order
router.get("/jewelleries/descending", (req, res) => {
  getProductsByCategory("jewelleries", -1, res);
});

// Route: Get Footwares in Ascending Order
router.get("/footwares/ascending", (req, res) => {
  getProductsByCategory("footwares", 1, res);
});

// Route: Get Footwares in Descending Order
router.get("/footwares/descending", (req, res) => {
  getProductsByCategory("footwares", -1, res);
});

// Route: Get All Products (Default Order: Ascending)
router.get("/all", (req, res) => {
  getProductsByCategory("all", 1, res);
});

module.exports = router;
