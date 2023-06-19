"use strict";

const { Types } = require("mongoose");
const { inventory } = require("../../models/inventory.model");
const {
  getSelectData,
  unGetSelectData,
  convertToObjectIdMongoDB,
} = require("../../utils");

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

const reservationInventory = async ({ product_id, quantity, cart_id }) => {
  const query = {
    inventory_product_id: convertToObjectIdMongoDB(product_id),
    inventory_stock: { $gte: quantity },
  };
  const updateSet = {
    $inc: {
      inventory_stock: -quantity,
    },
    $push: {
      inventory_reservations: {
        quantity,
        cart_id,
        createOn: new Date(),
      },
    },
  };

  const options = { upsert: true, new: true };

  return await inventory.updateOne(query, updateSet, options);
};

module.exports = {
  insertInventory,
  reservationInventory,
};
