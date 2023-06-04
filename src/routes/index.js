"use strict";

const express = require("express");
const router = express.Router();

// // init routes
// router.get("", (req, res) => {
//   return res.status(200).json({
//     message: "OK",
//   });
// });

router.use('/v1/api', require('./access'))

module.exports = router;
