"use strict";

const express = require("express");
const cartController = require("../../controllers/cart.controller");
const { authentication } = require("../../auth/authUtils");
const asyncHandler = require("../../helpers/asyncHandler");

const router = express.Router();

// authentication
router.use(authentication);
// --------------

router.get("", asyncHandler(cartController.list));
router.post("", asyncHandler(cartController.addToCart));
router.post("/update", asyncHandler(cartController.update));
router.delete("", asyncHandler(cartController.delete));

module.exports = router;
