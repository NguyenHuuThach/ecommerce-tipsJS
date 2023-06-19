"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { inventory } = require("../models/inventory.model");

const {
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongoDB,
} = require("../utils");
const { findProduct } = require("./product.service");

class InventoryService {
  static async addStockToInventory({
    stock,
    product_id,
    shop_id,
    location = "132, Le Lai, HCM city",
  }) {
    const product = await findProduct(product_id);
    if (!product) throw new BadRequestError("The product does not exists!!!");

    const query = {
      inventory_shop_id: shop_id,
      inventory_product_id: product_id,
    };

    const updateSet = {
      $inc: {
        inventory_stock: stock,
      },
      $set: {
        inventory_location: location,
      },
    };

    const options = { upsert: true, new: true };

    return await inventory.findOneAndUpdate(query, updateSet, options);
  }
}

module.exports = InventoryService;
