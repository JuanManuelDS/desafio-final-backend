const fs = require("fs");
const moment = require("moment");

class Carrito {
  //Solo llamo a esta función si no existe un id en el localStorage del navegador
  createId() {
    let cartList = this.getAll();
    console.log(cartList.length);
    let id = 0;
    if (cartList.length != 0) {
      let indiceIDs = cartList.map((x) => x.id).sort();
      id = indiceIDs[cartList.length - 1] + 1;
    }
    this.createCart(id);
    return id;
  }

  getAll() {
    let data, file;
    try {
      file = fs.readFileSync(__dirname + "/carritos.json", "utf-8");
    } catch (err) {
      console.log(
        "Hubo un error al leer el archivo en la función getAll() de Carrito: " +
          err
      );
    }
    if (file) {
      data = JSON.parse(file);
    }
    return file ? data : [];
  }

  getCartById(cartId) {
    let cartList = this.getAll();
    let cart = cartList.find((element) => element.id == cartId);
    if (cart) {
      return cart;
    } else {
      console.log("No existe un carrito con el número de ID: " + cartId);
    }
  }

  createCart(id) {
    const timestamp = moment().format("YYYY/MM/D hh:mm:ss");
    const newCart = { id: id, timestamp: timestamp, productos: [] };
    const cartList = this.getAll();
    cartList.push(newCart);
    try {
      fs.writeFileSync(__dirname + "/carritos.json", JSON.stringify(cartList));
    } catch (error) {
      console.log(
        "Hubo un error al intentar reescribir el archivo en createCart() de Carrito: " +
          error
      );
    }
  }

  addToCart(cartId, product) {
    //Busco el carrito por id
    let cart = this.getCartById(cartId);
    //Le inserto el producto
    cart.productos.push(product);
    //Traigo toda la lista de carrito para reemplazar el carrito desactualizado con el que tiene el producto
    let cartList = this.getAll();
    cartList.forEach((element) => {
      if (element.id == cart.id) console.log("Verdadero!");
    });
    let cartIndex = cartList.findIndex((element) => element.id == cart.id);
    cartList[cartIndex] = cart;
    console.log(cartList);
    try {
      fs.writeFileSync(__dirname + "/carritos.json", JSON.stringify(cartList));
      return true;
    } catch (error) {
      console.log(
        "Hubo un error al intentar reescribir la lista de carritos en addToCart() en carrito.js: " +
          error
      );
      return false;
    }
  }

  deleteById(cartId, productId) {
    let cartList = this.getAll();
    let newCart = this.getCartById(cartId);
    let indexDelProductoAEliminar = newCart.productos.findIndex(
      (element) => element.id == productId
    );
    newCart.productos.splice(indexDelProductoAEliminar, 1);
    let indexCarritoAModificar = cartList.findIndex(
      (element) => element.id == cartId
    );
    cartList[indexCarritoAModificar] = newCart;
    try {
      fs.writeFileSync(__dirname + "/carritos.json", JSON.stringify(cartList));
      return true;
    } catch (error) {
      console.log(
        "Hubo un error al reescribir el archivo en deleteById() en carrito: " +
          error
      );
      return false;
    }
  }

  deleteCartById(cartId) {
    let cartList = this.getAll();
    if (cartList.length > 0) {
      let indexCarritoAEliminar = cartList.findIndex(
        (element) => element.id == cartId
      );
      cartList.splice(indexCarritoAEliminar, 1);
    } else {
      cartList = [];
    }
    try {
      fs.writeFileSync(__dirname + "/carritos.json", JSON.stringify(cartList));
      return true;
    } catch (error) {
      console.log(
        "Hubo un error al intentar eliminar el carrito en deleteCartById(): " +
          error
      );
      return false;
    }
  }
}

module.exports = Carrito;
