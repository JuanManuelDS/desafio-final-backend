const Product = require("../models/producto.js");

class Productos {
  async getAll() {
    return await Product.find({});
  }

  async getById(id) {
    const product = await Product.findOne({ _id: id });
    return product ? product : false;
  }

  async deleteById(id) {
    const deleted = await Product.deleteOne({ _id: id });
    return deleted.deletedCount == 1 ? true : false;
  }

  async save(product) {
    const newProduct = new Product({
      ...product,
    });
    try {
      await newProduct.save();
      return true;
    } catch (err) {
      console.log(err.message);
    }
  }

  async modify(productId, newProductInfo) {
    let modified = false;
    const modifyProduct = await Product.updateOne(
      { _id: productId },
      {
        $set: {
          ...newProductInfo,
        },
      }
    );
    if (modifyProduct.modifiedCount == 1) modified = true;
    return modified;
  }
}

module.exports = Productos;
