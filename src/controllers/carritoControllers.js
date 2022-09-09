const Carrito = require('../carrito.js');
const Contenedor = require('../contenedor.js');
const carrito = new Carrito();
const productos = new Contenedor();


function getCarrito(req, res) {
  const { id } = req.params;
  const cart = carrito.getCartById(id);
  if (cart) {
    res.json({ success: "ok", productos: JSON.stringify(cart.productos) });
  } else {
    res.json({
      success: "error",
      message: "Hubo un error al cargar el carrito",
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
  const productAdded = carrito.addToCart(cartId, productToAdd);
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
  const { id } = req.params;
  const { id_prod } = req.params;
  const deleted = carrito.deleteById(id, id_prod);
  deleted
    ? res.json({ success: "ok", deleted: true })
    : res.json({ success: "error", deleted: false });
}

function deleteCarrito(req, res) {
  const cartId = req.params.id;
  const deleted = carrito.deleteCartById(cartId);
  deleted ? res.json({ success: "ok" }) : res.json({ success: "error" });
}

module.exports = {
  getCarrito,
  createCarrito,
  addToCarrito,
  deleteCarrito,
  deleteFromCarrito,
};
