"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signup = async ({ name, email, password }) => {
    try {
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop)
        return {
          code: "xxx",
          message: "Shop already registered!",
        };

      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        // Cach nay rat bao mat
        // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        //   modulusLength: 4096,
        //   privateKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        //   publicKeyEncoding: {
        //     type: "pkcs1",
        //     format: "pem",
        //   },
        // });

        const publicKey = crypto.randomBytes(64).toString("hex");
        const privateKey = crypto.randomBytes(64).toString("hex");

        // const publicKeyString = await KeyTokenService.createKeyToken({
        //   shopId: newShop._id,
        //   publicKey,
        // });

        const keyStore = await KeyTokenService.createKeyToken({
          shopId: newShop._id,
          publicKey,
          privateKey,
        });

        // if (!publicKeyString)
        //   return {
        //     code: "xxx",
        //     message: "publicKeyString error!",
        //   };
        if (!keyStore)
          return {
            code: "xxx",
            message: "keyStore error!",
          };

        // const publicKeyObject = crypto.createPublicKey(publicKeyString);

        // const tokens = await createTokenPair(
        //   { shopId: newShop._id, email },
        //   publicKeyObject,
        //   privateKey
        // );

        const tokens = await createTokenPair(
          { shopId: newShop._id, email },
          publicKey,
          privateKey
        );

        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              data: newShop,
            }),
            tokens,
          },
        };
      }

      return {
        code: 201,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
