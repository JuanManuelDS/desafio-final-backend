const { carts } = require("../../config.js");
const moment = require("moment");

class Carrito {
  async getAll() {
    const snapshot = await carts.get();
    const cart = snapshot.docs.map((doc) => doc.data());
    return cart;
  }

  async createCart() {
    const timestamp = moment().format("YYYY/MM/D hh:mm:ss");
    const newCart = { products: [], timestamp: timestamp };
    const newDoc = await carts.doc();
    newDoc.set(newCart);
    return await newDoc.id;
  }

  async add(cartId, productToAdd) {
    const search = await this.getById(cartId);
    let cartToUpdate;
    if (search.found) {
      cartToUpdate = found.cart;
    } else {
      console.log(search.message);
      return false;
    }
    //Chequeo si el productos está repetido, y si lo está solamente agrego una unidad más al carrito
    const productIsRepeated = this.isRepeated(productToAdd, cartToUpdate);

    if (productIsRepeated) {
      cartToUpdate.products[productIsRepeated].quantity++;
    } else {
      //Quito el stock del producto del producto que voy a agregar al carrito porque no me interesa
      const { stock, ...product } = productToAdd;
      cartToUpdate.products.push({ ...product, quantity: 1 });
    }
    try {
      await carts.doc(cartId).update(cartToUpdate);
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  }

  async deleteProduct(cartId, productId) {
    const cartSearch = await this.getById(cartId);
    let cart;

    if (cartSearch.found) {
      cart = found.cart;
    } else {
      console.log(cartSearch.message);
      return false;
    }

    if (cart.products.length > 0) {
      const productToDeleteIndex = cart.products.findIndex(
        (element) => element.id == productId
      );
      if (productToDeleteIndex >= 0) {
        cart.products.splice(productToDeleteIndex, 1);
      }
    } else {
      cart.products = [];
    }

    try {
      await Carts.doc(cartId).update(cart);
      return true;
    } catch (err) {
      console.log(err.message);
      return false;
    }
  }

  async deleteCart(cartId) {
    try {
      await carts.doc(cartId).delete();
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
    const snapshot = await carts.doc(cartId).get();
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

module.exports = Carrito;
