const Contenedor = require("./src/contenedor");
const Carrito = require("./src/carrito");
const express = require("express");

const app = express();
const { Router } = express;
const router = Router();
const server = app.listen(process.env.PORT || 8080);
let productos = new Contenedor();
let carrito = new Carrito();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);

//Aquí estoy seteando que cuando entren a localhost.com/ les devuelva index.html
app.get("/", (request, response) => {
  response.sendFile("public/pages/index.html", { root: __dirname });
});

app.get("/productos", (request, response) => {
  response.sendFile("public/pages/productos.html", { root: __dirname });
});

app.get("/cart", (request, response) => {
  response.sendFile("public/pages/cart.html", { root: __dirname });
});

/*-------------------- PRODUCTOS API--------------- */

router.get("/productos", (request, response) => {
  const { query } = request;
  //Chequeo si hay algo en el query
  if (Object.keys(query).length === 0) {
    response.json(productos.getAll());
  }
});

router.get("/productos/:id", (request, response) => {
  const { id } = request.params;
  const productList = productos.getAll();
  const productFound = productList.find((element) => element.id == id);
  productFound
    ? response.json({ success: "ok", product: productFound })
    : response.json({
        success: "error",
        message: `El producto con ID ${id}, no se encuentra en nuestra lista de productos`,
      });
});

router.post("/productos", (request, response) => {
  const { body } = request;
  const productAdded = productos.save(body);
  productAdded
    ? response.json({
        success: "ok",
        newProduct: productos.getById(productAdded),
      })
    : response.json({
        success: "error",
        message: "Ha ocurrido un problema al agregar su producto",
      });
});

router.put("/productos/:id", (request, response) => {
  const { id } = request.params;
  const { body } = request;
  if (productos.modify({ id: id, ...body })) {
    response.json({ success: "ok" });
  } else
    response.json({
      success: "error",
      message: "Ha ocurrido algún error al intentar modificar el producto",
    });
});

router.delete("/productos/:id", (request, response) => {
  const { id } = request.params;
  const productDeleted = productos.deleteById(id);
  productDeleted
    ? response.json({ success: "ok" })
    : response.json("El producto no se encuentra en nuestra base de datos");
});

/*-----------CARRITO API-----------------*/

router.post("/carrito", (request, response) => {
  try {
    const cartId = carrito.createId();
    response.json({ success: "ok", id: cartId });
  } catch (err) {
    console.log("sigo entrando en error");
    response.json({
      success: "error",
      message: "Hubo un error al intentar crear el Id del carrito",
    });
  }
});

router.post("/carrito/:id/productos", (request, response) => {
  const productId = request.params.id;
  const { cartId } = request.body;
  const productToAdd = productos.getById(productId);
  const productAdded = carrito.addToCart(cartId, productToAdd);
  if (productAdded) {
    response.json({
      success: "ok",
      message: "El producto ha sido añadido exitosamente!",
    });
  } else {
    response.json({
      success: "error",
      message: "Hubo un error al añadir el producto al carrito",
    });
  }
});

router.get("/carrito/:id/productos", (request, response) => {
  const { id } = request.params;
  const cart = carrito.getCartById(id);
  if (cart) {
    response.json({ success: "ok", productos: JSON.stringify(cart.productos) });
  } else {
    response.json({
      success: "error",
      message: "Hubo un error al cargar el carrito",
    });
  }
});

router.delete("/carrito/:id/productos/:id_prod", (request, response) => {
  const { id } = request.params;
  const { id_prod } = request.params;
  const deleted = carrito.deleteById(id, id_prod);
  deleted
    ? response.json({ success: "ok", deleted: true })
    : response.json({ success: "error", deleted: false });
});

router.delete("/carrito/:id", (request, response) => {
  const cartId = request.params.id;
  const deleted = carrito.deleteCartById(cartId);
  deleted
    ? response.json({ success: "ok" })
    : response.json({ success: "error" });
});
