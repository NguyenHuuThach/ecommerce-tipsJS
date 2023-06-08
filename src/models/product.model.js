"use strict";

const mongoose = require("mongoose");
const slugify = require("slugify");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

var productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_slug: {
      type: String,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture", "Drink", "Food"],
    },
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    product_attributes: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    product_ratings_average: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be above 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: { type: Array, default: [] },
    is_draft: { type: Boolean, default: true, index: true, select: false },
    is_published: { type: Boolean, default: false, index: true, select: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

productSchema.index({ product_name: "text", product_description: "text" });

productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

const clothingSchema = new mongoose.Schema(
  {
    brand: { type: String, require: true },
    size: { type: String },
    material: { type: String },
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  {
    timestamps: true,
    collection: "Clothes",
  }
);

const electronicSchema = new mongoose.Schema(
  {
    manufacturer: { type: String, require: true },
    model: { type: String },
    color: { type: String },
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  {
    timestamps: true,
    collection: "Electronics",
  }
);

const furnitureSchema = new mongoose.Schema(
  {
    brand: { type: String, require: true },
    size: { type: String },
    material: { type: String },
    product_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
  },
  {
    timestamps: true,
    collection: "Furniture",
  }
);

module.exports = {
  product: mongoose.model(DOCUMENT_NAME, productSchema),
  electronic: mongoose.model("Electronics", electronicSchema),
  clothing: mongoose.model("Clothes", clothingSchema),
  furniture: mongoose.model("Furniture", furnitureSchema),
};
