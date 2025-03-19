const mongoose = require("mongoose");

// Defining the Address Schema
const AddressSchema = new mongoose.Schema({
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  country: { type: String, trim: true },
  postalCode: { type: String, match: [/^\d{5,6}$/, "Invalid postal code"] },
});

// Defining the User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
    },
    profilePic: {
      type: String,
      required: false,
    },
    addresses: [AddressSchema], // ✅ Now supports multiple addresses
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    orders: [
      {
        products: [
          {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true, min: 1 },
          },
        ],
        totalAmount: { type: Number, required: true },
        status: {
          type: String,
          enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
          default: "Pending",
        },
        orderDate: { type: Date, default: Date.now },
        deliveredDate: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

// Creating the User Model
const User = mongoose.model("User", userSchema);

module.exports = User;