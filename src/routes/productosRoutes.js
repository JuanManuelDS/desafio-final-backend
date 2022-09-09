const express = require("express");
const {
  getProductos,
  getProducto,
  postProducto,
  modifyProducto,
  deleteProducto,
} = require("../controllers/productosControllers.js");

const router = express.Router();

router.get("/", getProductos);

router.get("/:id", getProducto);

router.post("/", postProducto);

router.put("/:id", modifyProducto);

router.delete("/:id", deleteProducto);

module.exports = router;