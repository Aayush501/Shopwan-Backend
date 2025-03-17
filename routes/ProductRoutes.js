const express = require("express");
const router = express.Router();
const Product = require("../schemas/Product");

// Helper function to fetch and sort products
const getProductsByCategory = async (category, order, req, res) => {
  try {
    console.log("fetching");
    const filter = category === "all" ? {} : { category }; // Fetch all or specific category
    console.log("Fetched all or specific category");
    const products = await Product.find(filter).sort({ price: order });
    console.log("Found sorted Products");

    // Attach full image URL to each product
    console.log("attaching images");
    const productsWithImages = products.map(product => ({
      ...product.toObject(),
      images: product.images.map(img => `${req.protocol}://${req.get("host")}${img}`)
    }));

    console.log("Returning responses");
    res.json(productsWithImages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Route: Get Clothes in Ascending Order
router.get("/clothes/ascending", (req, res) => {
  getProductsByCategory("clothes", 1, req, res);
});

// Route: Get Clothes in Descending Order
router.get("/clothes/descending", (req, res) => {
  getProductsByCategory("clothes", -1, req, res);
});

// Route: Get Jewelleries in Ascending Order
router.get("/jewelleries/ascending", (req, res) => {
  getProductsByCategory("jewelleries", 1, req, res);
});

// Route: Get Jewelleries in Descending Order
router.get("/jewelleries/descending", (req, res) => {
  getProductsByCategory("jewelleries", -1, req, res);
});

// Route: Get Footwares in Ascending Order
router.get("/footwares/ascending", (req, res) => {
  getProductsByCategory("footwares", 1, req, res);
});

// Route: Get Footwares in Descending Order
router.get("/footwares/descending", (req, res) => {
  getProductsByCategory("footwares", -1, req, res);
});

// Route: Get All Products (Default Order: Ascending)
router.get("/all", async (req, res) => {
  try{
    const allProducts = await Product.find();
    res.status(200).json(allProducts);
  } catch(error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

module.exports = router;
