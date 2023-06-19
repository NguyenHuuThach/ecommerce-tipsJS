"use strict";

const { Types } = require("mongoose");
const {
  product,
  electronic,
  clothing,
  furniture,
} = require("../../models/product.model");
const { getSelectData, unGetSelectData } = require("../../utils");

const findAllDraftsForShop = async ({ query, skip, limit }) => {
  return await queryProduct({ query, skip, limit });
};

const findAllPublishesForShop = async ({ query, skip, limit }) => {
  return await queryProduct({ query, skip, limit });
};

const findAllProduct = async ({ limit, sort, page, filter, select }) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  return await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    .exec();
};

const findProduct = async ({ product_id, unSelect }) => {
  return await product.findById(product_id).select(unGetSelectData(unSelect));
};

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const result = await product
    .find(
      {
        is_published: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();

  return result;
};

const publishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) return null;

  foundShop.is_draft = false;
  foundShop.is_published = true;

  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};
const unpublishProductByShop = async ({ product_shop, product_id }) => {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });

  if (!foundShop) return null;

  foundShop.is_draft = true;
  foundShop.is_published = false;

  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};

const queryProduct = async ({ query, skip, limit }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const updateProductById = async ({
  product_id,
  payload,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(product_id, payload, { new: isNew });
};

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await findProduct({
        product_id: product.product_id,
        unSelect: [],
      });

      if (foundProduct) {
        return {
          price: foundProduct.product_price,
          quantity: foundProduct.product_quantity,
          product_id: foundProduct._id,
        };
      }
    })
  );
};

module.exports = {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishesForShop,
  unpublishProductByShop,
  searchProductByUser,
  findAllProduct,
  findProduct,
  updateProductById,
  checkProductByServer,
};
