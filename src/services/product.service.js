"use strict";

const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/product.model");

const { BadRequestError, ForbiddenError } = require("../core/error.response");

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
    return await product.create({ ...this, _id: product_id });
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
}

// register product type
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;