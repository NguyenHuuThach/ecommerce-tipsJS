"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create New Product Success!",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.shop.shopId,
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Update Product Success!",
      metadata: await ProductService.updateProduct(
        req.body.product_type,
        req.params.product_id,
        {
          ...req.body,
          product_shop: req.shop.shopId,
        }
      ),
    }).send(res);
  };

  publishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Publish Product By Shop Success!",
      metadata: await ProductService.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.shop.shopId,
      }),
    }).send(res);
  };

  unpublishProductByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Unpublish Product By Shop Success!",
      metadata: await ProductService.unpublishProductByShop({
        product_id: req.params.id,
        product_shop: req.shop.shopId,
      }),
    }).send(res);
  };

  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get List Draft Success!",
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.shop.shopId,
      }),
    }).send(res);
  };

  getAllPublishesForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get List Published Success!",
      metadata: await ProductService.findAllPublishesForShop({
        product_shop: req.shop.shopId,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Get List Search Product Success!",
      metadata: await ProductService.searchProduct(req.params),
    }).send(res);
  };

  findAllProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Find All Product Success!",
      metadata: await ProductService.findAllProduct(req.query),
    }).send(res);
  };

  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Find Product Success!",
      metadata: await ProductService.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
