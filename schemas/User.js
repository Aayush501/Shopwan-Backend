const mongoose = require("mongoose");

// Defining the User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name is mandatory
    trim: true, // Removes leading/trailing spaces
  },
  username: {
    type: String,
    required: true, // Name is mandatory
    trim: true, // Removes leading/trailing spaces
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate emails
    trim: true,
    lowercase: true, // Converts email to lowercase
  },
  phone: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate phone numbers
    match: [/^\d{10}$/, "Phone number must be 10 digits"], // Enforces exactly 10 digits
  },
  profilePic: {
    type: String, 
    required: false,
  },
  address: {
    type: [String],
    trim: true,
  },
  cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
}, { timestamps: true }); // Adds createdAt & updatedAt fields

// Creating the User Model
const User = mongoose.model("User", userSchema);

module.exports = User;