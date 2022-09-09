const fs = require("fs");

const data = JSON.parse(
  fs.readFileSync(__dirname + "/listaProductos.json", "utf-8")
);

console.log(data);
