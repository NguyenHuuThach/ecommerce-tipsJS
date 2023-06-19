"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const cartModel = require("../models/cart.model");

const {
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongoDB,
} = require("../utils");
const { findAllProduct, findProduct } = require("./product.service");

class CartService {
  static async createUserCart({ user_id, product }) {
    const query = { cart_user_id: user_id, cart_state: "active" },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
      },
      options = { upsert: true, new: true };

    return await cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ user_id, product }) {
    const { product_id, quantity } = product;

    const query = {
        cart_user_id: user_id,
        cart_state: "active",
        "cart_products.product_id": product_id,
      },
      updateSet = {
        $inc: {
          "cart_products.$.quantity": quantity,
        },
      },
      options = { upsert: true, new: true };

    return await cartModel.findOneAndUpdate(query, updateSet, options);
  }

  static async addToCart({ user_id, product = {} }) {
    const userCart = await cartModel.findOne({ cart_user_id: user_id });

    if (!userCart) {
      return await CartService.createUserCart({ user_id, product });
    }

    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];

      return await userCart.save();
    }

    return await CartService.updateUserCartQuantity({ user_id, product });
  }

  static async addToCartV2({ user_id, shop_order_ids = {} }) {
    const { product_id, quantity, old_quantity } =
      shop_order_ids[0]?.item_products[0];

    const foundProduct = await findProduct({ product_id });

    if (!foundProduct) throw new NotFoundError("");

    if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shop_id) {
      throw new NotFoundError("Product do not belong to the shop");
    }

    if (quantity === 0) {
    }

    return await CartService.updateUserCartQuantity({
      user_id,
      product: {
        product_id,
        quantity: quantity - old_quantity,
      },
    });
  }

  static async deleteItemUserCart({ user_id, product_id }) {
    const query = { cart_user_id: user_id, cart_state: "active" };

    const updateSet = {
      $pull: {
        cart_products: { product_id },
      },
    };

    const deleteCart = await cartModel.updateOne(query, updateSet);

    return deleteCart;
  }

  static async getListUserCart({ user_id }) {
    return await cartModel
      .findOne({
        cart_user_id: user_id,
      })
      .lean();
  }
}

module.exports = CartService;
