"use strict";

const { Types } = require("mongoose");
const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({
    shopId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // cach nay rat bao mat
      // const publicKeyString = publicKey.toString();
      // const tokens = await keytokenModel.create({
      //   shop: shopId,
      //   publicKey: publicKeyString,
      //   privateKey,
      // });

      const filter = { shop: shopId };
      const update = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };

      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static findByShopId = async (shopId) => {
    return await keytokenModel.findOne({ shop: shopId });
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken });
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };

  static removeKeyByShopId = async (shopId) => {
    return await keytokenModel.deleteOne({ shop: shopId });
  };

  static removeKeyById = async (id) => {
    return await keytokenModel.deleteOne(id);
  };
}

module.exports = KeyTokenService;
