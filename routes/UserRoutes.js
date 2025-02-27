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


router.post("/saveUser", async (req, res) => {
  try {
      console.log("Request Body:", req.body);

      const { clerkId, name, username, email, profilePic } = req.body;

      // Extract only the last 10 digits of the phone number
      const phone = req.body.phone ? req.body.phone.replace(/\D/g, "").slice(-10) : null;

      if (!email) {
          return res.status(400).json({ message: "Email is required" });
      }

      let user = await User.findOne({ email });

      if (!user) {
          user = new User({
              name,
              username,
              email,
              phone, // Now stores only the last 10 digits
              profilePic,
              cart: [],
              wishlist: [],
          });

          await user.save();
          return res.status(201).json({ message: "User created successfully", user });
      }

      res.status(200).json({ message: "User already exists", user });
  } catch (error) {
      console.error("Error saving user:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

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
      const userId = req.headers.authorization; // Extract user ID from headers

      if (!userId) return res.status(400).json({ message: "User ID required in header" });

      const product = await Product.findOne({ uid: productId });
      if (!product) return res.status(404).json({ message: "Product not found" });

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (user.cart.includes(productId)) return res.status(400).json({ message: "Product already in cart" });

      user.cart.push(productId);
      await user.save();

      res.json({ message: "Product added to cart", cart: user.cart });
    } catch (error) {
      res.status(500).json({ message: "Error adding product to cart", error });
    }
  }
);

// ✅ Route: Add a product to the wishlist
router.post(
  "/wishlist/add",
  verifyUser,
  [body("productId").notEmpty().withMessage("Product ID is required")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { productId } = req.body;
      const userId = req.headers.authorization; // Extract user ID from headers

      if (!userId) return res.status(400).json({ message: "User ID required in header" });

      const product = await Product.findOne({ uid: productId });
      if (!product) return res.status(404).json({ message: "Product not found" });

      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      if (user.wishlist.includes(productId)) return res.status(400).json({ message: "Product already in wishlist" });

      user.wishlist.push(productId);
      await user.save();

      res.json({ message: "Product added to wishlist", wishlist: user.wishlist });
    } catch (error) {
      res.status(500).json({ message: "Error adding product to wishlist", error });
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
