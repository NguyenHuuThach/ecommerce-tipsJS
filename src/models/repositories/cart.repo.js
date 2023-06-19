const { convertToObjectIdMongoDB } = require("../../utils");
const cartModel = require("../cart.model");

const findCartById = async (cart_id) => {
  return await cartModel
    .findOne({ _id: convertToObjectIdMongoDB(cart_id), cart_state: "active" })
    .lean();
};

module.exports = { findCartById };
