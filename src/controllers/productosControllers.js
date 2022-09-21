const { ProductosDaos } = require("../daos/mainDaos.js");

const productos = new ProductosDaos();

async function getProductos(req, res) {
  const { query } = req;
  //Chequeo si hay algo en el query
  if (Object.keys(query).length === 0) {
    try {
      const products = await productos.getAll();
      res.status(200).json({ products });
    } catch (error) {
      res.statusMessage = error.message;
      res.status(500).end();
    }
  }
}

async function getProducto(req, res) {
  const { id } = req.params;
  try {
    const product = await productos.getById(id);
    console.log(product);
    res.status(200).json({ product });
  } catch (error) {
    res.statusMessage = error.message;
    res.status(404).end();
  }
}

async function postProducto(req, res) {
  const { body } = req;
  try {
    await productos.save(body);
    res.statusMessage = "Producto agregado correctamente";
    res.status(200).end();
  } catch (error) {
    res.statusMessage = error.message;
    res.status(500).end();
  }
}

async function modifyProducto(req, res) {
  const { id } = req.params;
  const { body: updatedProductInfo } = req;
  try {
    await productos.modify(id, updatedProductInfo);
    res.statusMessage = "Producto actualizado correctamente";
    res.status(200).end();
  } catch (err) {
    res.statusMessage = err.message;
    res.status(500).end();
  }
}

async function deleteProducto(req, res) {
  const { id } = req.params;
  try {
    await productos.deleteById(id);
    res.statusMessage = "El producto ha sido elimiado correctamente";
    res.status(200).end();
  } catch (err) {
    res.statusMessage = err.message;
    res.status(404).end();
  }
}

module.exports = {
  getProductos,
  getProducto,
  postProducto,
  modifyProducto,
  deleteProducto,
};
