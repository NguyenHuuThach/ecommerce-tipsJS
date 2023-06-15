"use strict";

const mongoose = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

var discountSchema = new mongoose.Schema(
  {
    discount_name: {
      type: String,
      require: true,
    },
    discount_description: {
      type: String,
      require: true,
    },
    discount_type: {
      type: String,
      default: "fixed_amount",
    },
    discount_value: {
      type: Number,
      require: true,
    },
    discount_code: {
      type: String,
      require: true,
    },
    discount_start_date: {
      type: Date,
      require: true,
    },
    discount_end_date: {
      type: Date,
      require: true,
    },
    discount_max_uses: {
      type: Number,
      require: true,
    },
    discount_uses_count: {
      type: Number,
      require: true,
    },
    discount_users_used: {
      type: Array,
      default: [],
    },
    discount_max_uses_per_user: {
      type: Number,
      require: true,
    },
    discount_min_order_value: {
      type: Number,
      require: true,
    },
    discount_shop_id: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "Shop",
    },
    discount_is_active: {
      type: Boolean,
      require: true,
    },
    discount_applies_to: {
      type: String,
      require: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = mongoose.model(DOCUMENT_NAME, discountSchema);
