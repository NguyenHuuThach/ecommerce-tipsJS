"use strict";

const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");

const router = express.Router();

// init routes
router.get("", (req, res) => {
  return res.status(200).json({
    message: "OK",
  });
});

// check apiKey
router.use(apiKey);

// check permissions
router.use(permission("0000"));

router.use("/v1/api/product", require("./product"));
router.use("/v1/api", require("./access"));

module.exports = router;
