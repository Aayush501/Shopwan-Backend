const express = require("express");
const router = express.Router();
const Product = require("../schemas/Product"); // Importing the Product model
const Admin = require("../schemas/Admin"); // Importing the Admin model (if needed)
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const path = require("path");

// Middleware for validating admin (Authentication to be implemented)
const verifyAdmin = async (req, res, next) => {
  try {
    // Example: Fetch admin from database (Modify according to authentication logic)
    const adminId = req.headers["admin-id"]; // Should be replaced with JWT or session authentication
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(403).json({ message: "Unauthorized admin access" });
    next();
  } catch (error) {
    res.status(500).json({ message: "Authentication error", error });
  }
};

const storage = multer.diskStorage({
  destination: "./uploads", // Local folder to store images
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});
const upload = multer({ storage });

// Route: Add a new product
// Add Product with Image Upload
router.post(
  "/add-product",
  upload.array("images", 5), // Accept up to 5 images
  [
    body("passkey").notEmpty().withMessage("Enter valid passkey"),
    body("name").notEmpty().withMessage("Product name is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("price").isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("category").notEmpty().withMessage("Category is required"),
    body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    console.log("Received data:", req.body); 

    if(!req.body.passkey === "IamPawanShrivastav"){
      return res.status(500).json({"error":"passkey not matches"});
    }

    try {
      // Store image file paths in MongoDB
      const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);

      const newProduct = new Product({
        name: req.body.name,
        uid: req.body.uid,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        subcategory: req.body.subcategory,
        actualItem: req.body.actualItem,
        stock: req.body.stock,
        images: imageUrls,
      });

      console.log("trying data:", newProduct);       

      await newProduct.save();
      res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
      res.status(500).json({ message: "Error adding product", error });
    }
  }
);

// Route: Remove a product
router.delete("/remove-product/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product removed successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Error removing product", error });
  }
});

// Route: See all products added by the admin
router.get("/products", verifyAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
});

// Route: Update a product
router.put(
  "/update-product/:id",
  verifyAdmin,
  [
    body("name").optional().notEmpty().withMessage("Product name cannot be empty"),
    body("description").optional().notEmpty().withMessage("Description cannot be empty"),
    body("price").optional().isFloat({ min: 0 }).withMessage("Price must be a positive number"),
    body("category").optional().notEmpty().withMessage("Category cannot be empty"),
    body("stock").optional().isInt({ min: 0 }).withMessage("Stock must be a non-negative number"),
    body("images").optional().isArray({ min: 1 }).withMessage("At least one image is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
      res.json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
      res.status(500).json({ message: "Error updating product", error });
    }
  }
);

module.exports = router;
