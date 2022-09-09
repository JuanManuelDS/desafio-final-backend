const Contenedor = require("../contenedor");

const productos = new Contenedor();

function getProductos(req, res) {
  const { query } = req;
  //Chequeo si hay algo en el query
  if (Object.keys(query).length === 0) {
    res.json(productos.getAll());
  }
}

function getProducto(req, res) {
  const { id } = req.params;
  const productList = productos.getAll();
  const productFound = productList.find((element) => element.id == id);
  productFound
    ? res.json({ success: "ok", product: productFound })
    : res.json({
        success: "error",
        message: `El producto con ID ${id}, no se encuentra en nuestra lista de productos`,
      });
}

function postProducto(req, res) {
  const { body } = req;
  const productAdded = productos.save(body);
  productAdded
    ? res.json({
        success: "ok",
        newProduct: productos.getById(productAdded),
      })
    : res.json({
        success: "error",
        message: "Ha ocurrido un problema al agregar su producto",
      });
}

function modifyProducto(req, res) {
  const { id } = req.params;
  const { body } = req;
  if (productos.modify({ id: id, ...body })) {
    res.json({ success: "ok" });
  } else
    res.json({
      success: "error",
      message: "Ha ocurrido algún error al intentar modificar el producto",
    });
}

function deleteProducto(req, res) {
  const { id } = req.params;
  const productDeleted = productos.deleteById(id);
  productDeleted
    ? res.json({ success: "ok" })
    : res.json("El producto no se encuentra en nuestra base de datos");
}

module.exports = {
  getProductos,
  getProducto,
  postProducto,
  modifyProducto,
  deleteProducto,
};
