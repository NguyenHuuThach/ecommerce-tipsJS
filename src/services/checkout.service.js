"use strict";

const { findCartById } = require("../models/repositories/cart.repo");

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");
const orderModel = require("../models/order.model");

class CheckoutService {
  static async checkoutReview({ cart_id, user_id, shop_order_ids }) {
    const foundCart = await findCartById(cart_id);

    if (!foundCart) throw new BadRequestError("Cart Does Not Exists!");

    const checkout_order = {
        totalPrice: 0,
        feeShip: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      shop_order_ids_new = [];

    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shop_id,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];

      const checkProductServer = await checkProductByServer(item_products);

      if (!checkProductServer[0]) throw new BadRequestError("order wrong!!!");

      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      checkout_order.totalPrice += checkoutPrice;

      const item_checkout = {
        shop_id,
        shop_discounts,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      if (shop_discounts.length > 0) {
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          discount_code: shop_discounts[0].code_id,
          user_id,
          discount_shop_id: shop_id,
          products: checkProductServer,
        });

        checkout_order.totalDiscount += discount;
        if (discount > 0) {
          item_checkout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      checkout_order.totalCheckout += item_checkout.priceApplyDiscount;

      shop_order_ids_new.push(item_checkout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  static async orderByUser({
    shop_order_ids,
    cart_id,
    user_id,
    user_address = {},
    user_payment = {},
  }) {
    const {} = await CheckoutService.checkoutReview({
      cart_id,
      user_id,
      shop_order_ids,
    });

    const products = shop_order_ids_new.flatMap((order) => order.item_products);
    const acquireProduct = [];
    for (let index = 0; index < products.length; index++) {
      const { product_id, quantity } = products[index];

      const keyLock = await acquireLock(product_id, quantity, cart_id);
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        "Mot so san pham da duoc cap nhat, vui long quay lai gio hang..."
      );
    }

    const newOrder = await orderModel.create({
      order_user_id: user_id,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });
    return newOrder;
  }

  static async getOrdersByUser() {}

  static async getOneOrderByUser() {}

  static async cancelOrderByUser() {}

  static async updateOrderStatusByShop() {}
}

module.exports = CheckoutService;
