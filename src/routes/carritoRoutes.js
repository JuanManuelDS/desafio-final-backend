const express = require("express");
const router = express.Router();

const {
  getCarrito,
  createCarrito,
  addToCarrito,
  deleteFromCarrito,
  deleteCarrito,
} = require("../controllers/carritoControllers");

router.get("/:id/productos", getCarrito);

router.post("/", createCarrito);

router.post("/:id/productos", addToCarrito);

router.delete("/:id/productos/:id_prod", deleteFromCarrito);

router.delete("/:id", deleteCarrito);

module.exports = router;
