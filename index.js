const Contenedor = require("./src/contenedor");
const express = require("express");

const app = express();
const { Router } = express;
const router = Router();
const server = app.listen(process.env.PORT || 8080);
let productos = new Contenedor();

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

/*-------------------- ROUTER API--------------- */

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
  const productToModify = productos.getById(id);
  productToModify.price += 1;
  response.json({
    success: "ok",
    message: "El precio del producto fue incrementado en $1 exitosamente",
  });
});

router.delete("/productos/:id", (request, response) => {
  const { id } = request.params;
  const productDeleted = productos.deleteById(id);
  productDeleted
    ? response.json({ success: "ok" })
    : response.json("El producto no se encuentra en nuestra base de datos");
});

/*-----------FIN ROUTER API-----------------*/
