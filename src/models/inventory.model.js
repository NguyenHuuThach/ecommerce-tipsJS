"use strict";

const mongoose = require("mongoose");

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

var inventorySchema = new mongoose.Schema(
  {
    inventory_product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    inventory_shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    inventory_location: {
      type: String,
      default: "unknown",
    },
    inventory_stock: {
      type: Number,
      require: true,
    },
    inventory_reservations: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  inventory: mongoose.model(DOCUMENT_NAME, inventorySchema),
};
