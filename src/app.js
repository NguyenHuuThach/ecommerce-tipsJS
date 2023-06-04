require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");

const { checkOverLoad } = require("./helpers/check.connect");

const app = express();

// init middleWares
app.use(morgan("combined"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// init DB
require("./dbs/init.mongodb");

// Check overload DB
// checkOverLoad();

// init routes
app.use("/", require("./routes"));

// handling error

module.exports = app;
