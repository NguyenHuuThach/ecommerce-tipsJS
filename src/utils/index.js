"use strict";

const _ = require("lodash");

const getInfoData = ({ fields = [], data = {} }) => {
  return _.pick(data, fields);
};

module.exports = {
  getInfoData,
};
