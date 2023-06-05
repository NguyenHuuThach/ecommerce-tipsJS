"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { authentication } = require("../../auth/authUtils");
const asyncHandler = require("../../helpers/asyncHandler");

const router = express.Router();

// signup
router.post("/shop/signup", asyncHandler(accessController.signup));
router.post("/shop/login", asyncHandler(accessController.login));

// authentication
router.use(authentication);
// --------------
router.post("/shop/logout", asyncHandler(accessController.logout));
router.post(
  "/shop/refresh-token",
  asyncHandler(accessController.handlerRefreshToken)
);

module.exports = router;
