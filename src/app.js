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
app.use((req, res, next) => {
  const error = new Error("Not Found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error!",
    // message:
    //   error.message && statusCode !== 500
    //     ? error.message
    //     : "Internal Server Error!",
  });
});

module.exports = app;
