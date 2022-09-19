const Carrito = require("../daos/mainDaos.js");
const Productos = require("../daos/mainDaos.js");
const carrito = new Carrito();
const productos = new Productos();

function getCarrito(req, res) {
  const { id } = req.params;
  const cart = carrito.getCartById(id);
  if (cart.found) {
    res.json({ success: "ok", productos: JSON.stringify(cart.cart.productos) });
  } else {
    res.json({
      success: "error",
      message: cart.message,
    });
  }
}

function createCarrito(req, res) {
  try {
    const cartId = carrito.createId();
    res.json({ success: "ok", id: cartId });
  } catch (err) {
    res.json({
      success: "error",
      message: "Hubo un error al intentar crear el Id del carrito",
    });
  }
}

function addToCarrito(req, res) {
  const productId = req.params.id;
  const { cartId } = req.body;
  const productToAdd = productos.getById(productId);
  const productAdded = carrito.add(cartId, productToAdd);
  if (productAdded) {
    res.json({
      success: "ok",
      message: "El producto ha sido añadido exitosamente!",
    });
  } else {
    res.json({
      success: "error",
      message: "Hubo un error al añadir el producto al carrito",
    });
  }
}

function deleteFromCarrito(req, res) {
  const { id, id_prod } = req.params;
  const deleted = carrito.deleteProduct(id, id_prod);
  deleted
    ? res.json({ success: "ok", deleted: true })
    : res.json({ success: "error", deleted: false });
}

function deleteCarrito(req, res) {
  const cartId = req.params.id;
  const deleted = carrito.deleteCart(cartId);
  deleted ? res.json({ success: "ok" }) : res.json({ success: "error" });
}

module.exports = {
  getCarrito,
  createCarrito,
  addToCarrito,
  deleteCarrito,
  deleteFromCarrito,
};
