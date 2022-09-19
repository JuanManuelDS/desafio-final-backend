const express = require("express");
const { connectToDatabases } = require("./config.js");
const carritoRoutes = require("./src/routes/carritoRoutes");
const productosRoutes = require("./src/routes/productosRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

connectToDatabases().then(() =>
  app.listen(PORT, () => console.log("Server running in port " + PORT))
);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/productos", productosRoutes);
app.use("/api/carrito", carritoRoutes);

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
