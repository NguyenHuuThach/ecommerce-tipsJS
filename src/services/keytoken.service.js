"use strict";

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({ shopId, publicKey, privateKey }) => {
    try {
      // cach nay rat bao mat
      // const publicKeyString = publicKey.toString();
      // const tokens = await keytokenModel.create({
      //   shop: shopId,
      //   publicKey: publicKeyString,
      //   privateKey,
      // });
      const tokens = await keytokenModel.create({
        shop: shopId,
        publicKey,
        privateKey,
      });
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

module.exports = KeyTokenService;
