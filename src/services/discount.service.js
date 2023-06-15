"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const discountModel = require("../models/discount.model");
const {
  findAllDiscountCodesSelect,
  checkDiscountExists,
} = require("../models/repositories/discount.repo");
const {
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongoDB,
} = require("../utils");
const { findAllProduct } = require("./product.service");

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_code,
      discount_start_date,
      discount_end_date,
      discount_max_uses,
      discount_uses_count,
      discount_users_used,
      discount_max_uses_per_user,
      discount_min_order_value,
      discount_shop_id,
      discount_is_active,
      discount_applies_to,
      discount_product_ids,
    } = payload;

    if (new Date(discount_start_date) >= new Date(discount_end_date)) {
      throw new BadRequestError("Start Date Must Be Before End Date!");
    }

    if (
      !(new Date() < new Date(discount_start_date)) ||
      !(new Date() < new Date(discount_end_date))
    ) {
      throw new BadRequestError("Discount Code Has Expired!");
    }

    const foundDiscount = await discountModel
      .findOne({
        discount_code,
        discount_shop_id,
      })
      .lean();
    if (foundDiscount) {
      throw new BadRequestError("Discount Exists!");
    }

    const newDiscount = await discountModel.create({
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_code,
      discount_start_date: new Date(discount_start_date),
      discount_end_date: new Date(discount_end_date),
      discount_max_uses,
      discount_uses_count,
      discount_users_used,
      discount_max_uses_per_user,
      discount_min_order_value: discount_min_order_value || 0,
      discount_shop_id,
      discount_is_active,
      discount_applies_to,
      discount_product_ids:
        discount_applies_to === "all" ? [] : discount_product_ids,
    });

    return newDiscount;
  }

  async updateDiscount(payload) {
    // const payload = removeUndefinedObject(this);
    // if (payload.product_attributes) {
    //   await updateProductById({
    //     product_id,
    //     payload: updateNestedObjectParser(
    //       removeUndefinedObject(payload.product_attributes)
    //     ),
    //     model: clothing,
    //   });
    // }
    // const updateProduct = await discountModel.updateOne(
    //   discount_id,
    //   updateNestedObjectParser(payload)
    // );
    // return updateProduct;
  }

  static async getAllDiscountCodesWithProduct({
    discount_code,
    discount_shop_id,
    user_id,
    limit,
    page,
  }) {
    const foundDiscount = await discountModel
      .findOne({
        discount_code,
        discount_shop_id,
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount Not Exists!");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;

    let products = [];

    if (discount_applies_to === "all") {
      products = await findAllProduct({
        filter: {
          product_shop: convertToObjectIdMongoDB(discount_shop_id),
          is_published: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    if (discount_applies_to === "specific") {
      products = await findAllProduct({
        filter: {
          _id: { $in: discount_product_ids },
          is_published: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }

    return products;
  }

  static async getAllDiscountCodesByShop({ limit, page, discount_shop_id }) {
    const discounts = await findAllDiscountCodesSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shop_id,
        discount_is_active: true,
      },
      unSelect: ["__v", "discount_shop_id"],
      model: discountModel,
    });

    return discounts;
  }

  static async getDiscountAmount({
    discount_code,
    user_id,
    discount_shop_id,
    products,
  }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code,
        discount_shop_id,
      },
    });
    if (!foundDiscount) {
      throw new NotFoundError("Discount Does Not Exist");
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_type,
      discount_value,
      discount_max_uses_per_user,
      discount_users_used,
    } = foundDiscount;

    if (!discount_is_active) throw new NotFoundError("Discount Expired!");
    if (!discount_max_uses) throw new NotFoundError("Discount Are Out!");

    if (
      !(new Date() < new Date(discount_start_date)) ||
      !(new Date() < new Date(discount_end_date))
    ) {
      throw new NotFoundError("Discount Expired!");
    }

    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          `Discount requires a minimum order value of ${discount_min_order_value}`
        );
      }
    }

    if (discount_max_uses_per_user > 0) {
      const userUsedDiscount = discount_users_used.find(
        (user) => user.user_id == user_id
      );
      if (userUsedDiscount) {
      }
    }

    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return { totalOrder, discount: amount, totalPrice: totalOrder - amount };
  }

  static async deleteDiscountCode({ shop_id, discount_code }) {
    const deleted = await discountModel.findOneAndUpdate({
      discount_code,
      discount_shop_id: convertToObjectIdMongoDB(shop_id),
    });

    return deleted;
  }

  static async cancelDiscountCode({ discount_code, shop_id, user_id }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,
      filter: {
        discount_code,
        discount_shop_id: convertToObjectIdMongoDB(shop_id),
      },
    });

    if (!foundDiscount) throw new NotFoundError("Discount does not exist");

    const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: user_id,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;
