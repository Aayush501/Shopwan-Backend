const mongoose = require("mongoose");

// Defining the Admin Schema
const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Admin name is mandatory
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
    password: {
      type: String,
      required: true, // Password is mandatory
    },
    role: {
      type: String,
      enum: ["superadmin", "admin"], // Defines roles with restricted values
      default: "admin", // Default role is "admin"
    },
  },
  { timestamps: true } // Adds createdAt & updatedAt fields
);

// Creating the Admin Model
const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
