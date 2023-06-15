"use strict";

const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");

const { BadRequestError, ForbiddenError } = require("../core/error.response");
const {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishesForShop,
  unpublishProductByShop,
  searchProductByUser,
  findAllProduct,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");
const { insertInventory } = require("../models/repositories/inventory.repo");

// define this class to create product
class ProductFactory {
  static productRegistry = {}; // key-class

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Type: ${type}`);
    return new productClass(payload).createProduct();

    // switch (type) {
    //   case "Electronic":
    //     return await new Electronic(payload).createProduct();
    //   case "Clothing":
    //     return await new Clothing(payload).createProduct();
    //   default:
    //     throw new BadRequestError(`Invalid Product Type: ${type}`);
    // }
  }
  static async updateProduct(type, product_id, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Type: ${type}`);
    return new productClass(payload).updateProduct(product_id);
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unpublishProductByShop({ product_shop, product_id }) {
    return await unpublishProductByShop({ product_shop, product_id });
  }

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, is_draft: true };
    return await findAllDraftsForShop({ query, skip, limit });
  }

  static async findAllPublishesForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, is_published: true };
    return await findAllPublishesForShop({ query, skip, limit });
  }

  static async searchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProduct({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { is_published: true },
    select = ["product_name", "product_price", "product_thumb"],
  }) {
    return await findAllProduct({ limit, sort, page, filter, select });
  }

  static async findProduct({ product_id }) {
    return await findProduct({ product_id, unSelect: ["__v"] });
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // create new product
  async createProduct(product_id) {
    const newProduct = await product.create({ ...this, _id: product_id });
    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
    }

    return newProduct;
  }

  async updateProduct(product_id, payload) {
    return await updateProductById({ product_id, payload, model: product });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Create New Clothing Error!");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Create New Product Error!");

    return newProduct;
  }

  async updateProduct(product_id) {
    const payload = removeUndefinedObject(this);
    if (payload.product_attributes) {
      await updateProductById({
        product_id,
        payload: updateNestedObjectParser(
          removeUndefinedObject(payload.product_attributes)
        ),
        model: clothing,
      });
    }

    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObjectParser(payload)
    );
    return updateProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("Create New Electronic Error!");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Create New Product Error!");

    return newProduct;
  }

  async updateProduct(product_id) {
    const payload = removeUndefinedObject(this);
    if (payload.product_attributes) {
      await updateProductById({
        product_id,
        payload: updateNestedObjectParser(
          removeUndefinedObject(payload.product_attributes)
        ),
        model: electronic,
      });
    }

    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObjectParser(payload)
    );
    return updateProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture) throw new BadRequestError("Create New Furniture Error!");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("Create New Product Error!");

    return newProduct;
  }

  async updateProduct(product_id) {
    const payload = removeUndefinedObject(this);
    if (payload.product_attributes) {
      await updateProductById({
        product_id,
        payload: updateNestedObjectParser(
          removeUndefinedObject(payload.product_attributes)
        ),
        model: furniture,
      });
    }

    const updateProduct = await super.updateProduct(
      product_id,
      updateNestedObjectParser(payload)
    );
    return updateProduct;
  }
}

// register product type
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
