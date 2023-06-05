"use strict";

const JWT = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByShopId } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESH_TOKEN: "x-rtoken",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // const accessToken = await JWT.sign(payload, privateKey, {
    //   algorithm: "RS256",
    //   expiresIn: "2 days",
    // });

    // const refreshToken = await JWT.sign(payload, privateKey, {
    //   algorithm: "RS256",
    //   expiresIn: "7 days",
    // });

    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};

const authentication = asyncHandler(async (req, res, next) => {
  const shopId = req.headers[HEADER.CLIENT_ID];
  if (!shopId) throw new AuthFailureError("Invalid Request!");

  const keyStore = await findByShopId(shopId);
  if (!keyStore) throw new NotFoundError("Not Found keyStore!");

  const refreshToken = req.headers[HEADER.REFRESH_TOKEN];

  if (refreshToken) {
    try {
      const decodeShop = JWT.verify(refreshToken, keyStore.privateKey);
      if (decodeShop.shopId !== shopId)
        throw new AuthFailureError("Invalid shopId");

      req.keyStore = keyStore;
      req.shop = decodeShop;
      req.refreshToken = refreshToken;

      return next();
    } catch (error) {
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request!");
  try {
    const decodeShop = JWT.verify(accessToken, keyStore.publicKey);
    if (decodeShop.shopId !== shopId)
      throw new AuthFailureError("Invalid shopId");

    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = (token, keySecret) => {
  return JWT.verify(token, keySecret);
};

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
