// Importing required modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const AdminRoutes = require('./routes/AdminRoutes.js');
const ProductRoutes = require('./routes/ProductRoutes.js');
const UserRoutes = require('./routes/UserRoutes.js');

require("dotenv").config(); // Loading environment variables from .env file 

// Initializing the Express application
const app = express();


const allowedOrigins = [
  "https://shopwan.vercel.app", // ✅ Replace with your actual frontend domain
  "https://shopwanadmin.vercel.app"
];

// Middleware setup
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // ✅ Allow cookies (if needed)
  methods: ["GET", "POST", "PUT", "DELETE"], // ✅ Allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allowed headers
})); // Enables Cross-Origin Resource Sharing


app.use(express.json()); // Parses incoming JSON requests

// Retrieving environment variables
const PORT = process.env.PORT || 5000; // Default to port 5000 if not defined
const MONGO_URI = process.env.MONGO_URI; // MongoDB connection string from .env

// Connecting to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Sample route for testing API
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

app.use("/uploads", express.static("uploads"));

app.use("/admin", AdminRoutes);
app.use("/products", ProductRoutes);
app.use("/user", UserRoutes);

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});