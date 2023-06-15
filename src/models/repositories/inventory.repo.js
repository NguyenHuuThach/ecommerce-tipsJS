"use strict";

const { Types } = require("mongoose");
const { inventory } = require("../../models/inventory.model");
const { getSelectData, unGetSelectData } = require("../../utils");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknown",
}) => {
  return await inventory.create({
    inventory_product_id: productId,
    inventory_shop_id: shopId,
    inventory_location: location,
    inventory_stock: stock,
  });
};

module.exports = {
  insertInventory,
};
