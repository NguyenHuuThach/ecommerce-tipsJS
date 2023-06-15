"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Success Code Generations",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        discount_shop_id: req.shop.shopId,
      }),
    }).send(res);
  };

  getAllDiscountCodesByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful Codes Found",
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        discount_shop_id: req.shop.shopId,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful Code Found",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  };

  getAllDiscountCodesWithProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful Code Found",
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
