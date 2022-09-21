const Product = require("../models/producto.js");
const moment = require("moment");

class Productos {
  async getAll() {
    const products = await Product.find({});
    return products;
  }

  async getById(id) {
    const product = await Product.findById(id);
    if (!product)
      throw Error(`No se ha encontrado ningún producto con el id ${id}`);
    return product;
  }

  async deleteById(id) {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted)
      throw Error(`No se ha encontrado ningún producto con el id ${id}`);
  }

  async save(product) {
    const newProduct = new Product({
      timestamp: moment().format("YYYY/MM/D hh:mm:ss"),
      ...product,
    });
    await newProduct.save();
  }

  async modify(productId, newProductInfo) {
    const modifyProduct = await Product.findByIdAndUpdate(
      { _id: productId },
      newProductInfo
    );
    if (modifyProduct == null)
      throw Error(
        "No se ha encontrado ningún producto con el id: " + productId
      );
  }
}

module.exports = { Productos };
