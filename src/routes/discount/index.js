"use strict";

const express = require("express");
const discountController = require("../../controllers/discount.controller");
const { authentication } = require("../../auth/authUtils");
const asyncHandler = require("../../helpers/asyncHandler");

const router = express.Router();

router.post("/amount", asyncHandler(discountController.getDiscountAmount));
router.get(
  "/list-product-code",
  asyncHandler(discountController.getAllDiscountCodesWithProduct)
);

// authentication
router.use(authentication);
// --------------

router.post("", asyncHandler(discountController.createDiscountCode));
router.get("", asyncHandler(discountController.getAllDiscountCodesByShop));

module.exports = router;
