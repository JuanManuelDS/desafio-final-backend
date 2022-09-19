const Productos = require("../daos/mainDaos.js");

const productos = new Productos();

async function getProductos(req, res) {
  const { query } = req;
  //Chequeo si hay algo en el query
  if (Object.keys(query).length === 0) {
    try {
      const productList = await productos.getAll();
      res.status(200).json({ products: JSON.stringify(productList) });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

async function getProducto(req, res) {
  const { id } = req.params;
  const productFound = await productos.getById(id);
  productFound
    ? res.status(200).json({ product: productFound })
    : res.status(404).json({
        message: `El producto con ID ${id}, no se encuentra en nuestra lista de productos`,
      });
}

async function postProducto(req, res) {
  const { body } = req;
  try {
    await productos.save(body);
    res.status(200).json({ message: "Producto agregado correctamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function modifyProducto(req, res) {
  const { id } = req.params;
  const { body } = req;
  try {
    await productos.modify({ id, ...body });
    res.status(200).json({ message: "Producto actualizado correctamente" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function deleteProducto(req, res) {
  const { id } = req.params;
  try {
    await productos.deleteById(id);
    res
      .status(200)
      .json({ message: "El producto ha sido elimiado correctamente" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  getProductos,
  getProducto,
  postProducto,
  modifyProducto,
  deleteProducto,
};
