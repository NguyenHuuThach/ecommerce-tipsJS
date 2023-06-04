const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");

const app = express();

// init middleWares
app.use(morgan("combined"));
app.use(helmet());
app.use(compression());

// init DB
require("./dbs/init.mongodb");

// init routes
app.get("/", (req, res) => {
  return res.status(200).json({
    msg: "OK",
  });
});

// handling error

module.exports = app;
