"use strict";

const express = require("express");
const productController = require("../../controllers/product.controller");
const { authentication } = require("../../auth/authUtils");
const asyncHandler = require("../../helpers/asyncHandler");

const router = express.Router();

router.get(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchProduct)
);
router.get("", asyncHandler(productController.findAllProduct));
router.get("/:product_id", asyncHandler(productController.findProduct));

// authentication
router.use(authentication);
// --------------
router.post("", asyncHandler(productController.createProduct));
router.patch("/:product_id", asyncHandler(productController.updateProduct));
router.post(
  "/publish/:id",
  asyncHandler(productController.publishProductByShop)
);
router.post(
  "/unpublish/:id",
  asyncHandler(productController.unpublishProductByShop)
);

router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(productController.getAllPublishesForShop)
);

module.exports = router;
