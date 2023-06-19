"use strict";

const express = require("express");
const inventoryController = require("../../controllers/inventory.controller");
const { authentication } = require("../../auth/authUtils");
const asyncHandler = require("../../helpers/asyncHandler");

const router = express.Router();

// authentication
router.use(authentication);
// --------------

router.post("", asyncHandler(inventoryController.addStockToInventory));
module.exports = router;
