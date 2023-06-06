"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { authentication } = require("../../auth/authUtils");
const asyncHandler = require("../../helpers/asyncHandler");

const router = express.Router();

// signup
router.post("/signup", asyncHandler(accessController.signup));
router.post("/login", asyncHandler(accessController.login));

// authentication
router.use(authentication);
// --------------
router.post("/logout", asyncHandler(accessController.logout));
router.post(
  "/refresh-token",
  asyncHandler(accessController.handlerRefreshToken)
);

module.exports = router;
