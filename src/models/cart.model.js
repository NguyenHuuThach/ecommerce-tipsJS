"use strict";

const mongoose = require("mongoose");

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

var CartSchema = new mongoose.Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ["active", "completed", "failed", "pending"],
    },
    cart_products: { type: Array, required: true, default: [] },
    cart_count_product: { type: Number, default: 0 },
    cart_user_id: { type: Number, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, CartSchema);
