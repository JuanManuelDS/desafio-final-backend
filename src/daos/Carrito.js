const moment = require("moment");
const { firebaseAdmin } = require("../../config.js");
const FieldValue = require("firebase-admin").firestore.FieldValue;

class Carrito {
  constructor() {
    this.db = firebaseAdmin.firestore();
    this.carts = this.db.collection("carts");
  }

  async getAll() {
    const snapshot = await this.carts.get();
    const cart = snapshot.docs.map((doc) => doc.data());
    return cart;
  }

  async createCart() {
    const timestamp = moment().format("YYYY/MM/D hh:mm:ss");
    const newCart = { products: [], timestamp: timestamp };
    const newDoc = await this.carts.doc();
    newDoc.set(newCart);
    return await newDoc.id;
  }

  async add(cartId, productToAdd) {
    const search = await this.getById(cartId);
    let cartToUpdate;
    if (search.found) {
      cartToUpdate = search.cart;
    } else {
      console.log(search.message);
      return false;
    }
    //Hago todo esto para parsear el objectId de mongo
    let product = { ...productToAdd.toObject() };
    let id = productToAdd._id;
    product._id = id.toString();
    try {
      await this.carts
        .doc(cartId)
        .update("products", FieldValue.arrayUnion(product));
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  }

  async deleteProduct(cartId, productToDelete) {
    const cartSearch = await this.getById(cartId);
    let cart;

    if (cartSearch.found) {
      cart = cartSearch.cart;
    } else {
      console.log(cartSearch.message);
      return false;
    }

    //Hago todo esto para parsear el objectId de mongo
    let product = { ...productToDelete.toObject() };
    let id = productToDelete._id;
    product._id = id.toString();

    try {
      await this.carts
        .doc(cartId)
        .update("products", FieldValue.arrayRemove(product));
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  }

  async deleteCart(cartId) {
    try {
      await this.carts.doc(cartId).delete();
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  }

  isRepeated(productToAdd, cartToUpdate) {
    let isRepeated = 0;
    if (cartToUpdate.products.length > 0) {
      cartToUpdate.products.forEach((element, index) => {
        if (element.id == productToAdd.id) {
          isRepeated = index;
        }
      });
    }
    return isRepeated;
  }

  async getById(cartId) {
    const snapshot = await this.carts.doc(cartId).get();
    if (!snapshot.exists) {
      return {
        found: false,
        message: `No se ha encontrado un carrito con el id ${cartId}`,
      };
    } else {
      const cart = snapshot.data();
      return { found: true, cart: cart };
    }
  }
}

module.exports = { Carrito };
