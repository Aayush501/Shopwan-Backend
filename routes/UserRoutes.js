const express = require("express");
const router = express.Router();
const User = require("../schemas/User");
const Product = require("../schemas/Product");
const { body, validationResult } = require("express-validator");

// Middleware to verify user existence
const verifyUser = async (req, res, next) => {
  try {
    const userId = req.headers["user-id"]; // Replace with actual authentication (JWT)
    if (!userId) return res.status(401).json({ message: "User ID required in headers" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: "User authentication error", error });
  }
};

// ✅ Route: Add a product to the cart
router.post(
  "/cart/add",
  verifyUser,
  [body("productId").notEmpty().withMessage("Product ID is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { productId } = req.body;
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ message: "Product not found" });

      const user = req.user;
      if (user.cart.includes(productId)) return res.status(400).json({ message: "Product already in cart" });

      user.cart.push(productId);
      await user.save();

      res.json({ message: "Product added to cart", cart: user.cart });
    } catch (error) {
      res.status(500).json({ message: "Error adding product to cart", error });
    }
  }
);

// ✅ Route: Remove a product from the cart
router.delete("/cart/remove/:productId", verifyUser, async (req, res) => {
  try {
    const { productId } = req.params;
    const user = req.user;

    const index = user.cart.indexOf(productId);
    if (index === -1) return res.status(404).json({ message: "Product not found in cart" });

    user.cart.splice(index, 1);
    await user.save();

    res.json({ message: "Product removed from cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Error removing product from cart", error });
  }
});

// ✅ Route: View User's Cart with Product Details
router.get("/cart", verifyUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart");
    res.json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error });
  }
});

module.exports = router;
