const { CarritoDaos } = require("../daos/mainDaos.js");
const { ProductosDaos } = require("../daos/mainDaos.js");
const carrito = new CarritoDaos();
const productos = new ProductosDaos();

async function getCarrito(req, res) {
  const { id } = req.params;
  const cart = await carrito.getById(id);
  if (cart.found) {
    res.json({ success: "ok", productos: cart.cart.products });
  } else {
    res.json({
      success: "error",
      message: cart.message,
    });
  }
}

async function createCarrito(req, res) {
  try {
    const cartId = await carrito.createCart();
    res.status(200).json({ id: cartId });
  } catch (err) {
    res.statusText = err.message;
    res.status(500).end();
  }
}

async function addToCarrito(req, res) {
  const productId = req.params.id;
  const { cartId } = req.body;
  const productToAdd = await productos.getById(productId);
  const productAdded = await carrito.add(cartId, productToAdd);
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

async function deleteFromCarrito(req, res) {
  const { id, id_prod } = req.params;
  const productToDelete = await productos.getById(id_prod);
  const deleted = await carrito.deleteProduct(id, productToDelete);
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
