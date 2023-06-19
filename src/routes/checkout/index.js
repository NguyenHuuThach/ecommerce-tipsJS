"use strict";

const express = require("express");
const checkoutController = require("../../controllers/checkout.controller");
const { authentication } = require("../../auth/authUtils");
const asyncHandler = require("../../helpers/asyncHandler");

const router = express.Router();

router.post("/review", asyncHandler(checkoutController.checkoutReview));

// authentication
router.use(authentication);
// --------------

module.exports = router;
