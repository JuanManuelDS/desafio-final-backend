const fs = require("fs");
const moment = require("moment");

class Contenedor {
  getAll() {
    let data, file;
    try {
      file = fs.readFileSync(__dirname + "/listaProductos.json", "utf-8");
    } catch (err) {
      console.log(
        "Hubo un error al leer el archivo en la función getAll(): " + err
      );
    }
    if (file) {
      data = JSON.parse(file);
    }
    return file ? data : [];
  }

  save(producto) {
    let listaProductos = this.getAll();
    let listaProductosJSON;
    const isRepeated = this.isRepeated(listaProductos, producto);

    if (!isRepeated) {
      producto.id = this.assignId(listaProductos);
      producto.timestamp = moment().format("YYYY/MM/D hh:mm:ss");
      listaProductos.push(producto);
      listaProductosJSON = JSON.stringify(listaProductos);
      try {
        fs.writeFileSync(
          __dirname + "/listaProductos.json",
          listaProductosJSON
        );
      } catch (err) {
        console.log(
          "Hubo un error al intentar reescribir el archivo en save(): " + err
        );
      }
    } else {
      //Si el producto se encuentra en la lista le aumento el stock en 1
      listaProductos[isRepeated].stock++;
    }

    return producto.id;
  }

  assignId(listaProductos) {
    let id = 0;

    if (listaProductos.length != 0) {
      let indiceIDs = listaProductos.map((x) => x.id).sort();
      //le asigno el número más alto de los ids existentes + 1
      id = indiceIDs[indiceIDs.length - 1] + 1;
    }

    return id;
  }

  isRepeated(listaProductos, producto) {
    let repeated = 0;
    listaProductos.forEach((element, index) => {
      if (
        element.title == producto.title &&
        element.price == producto.price &&
        element.description == producto.description
      )
        repeated = index;
    });
    return repeated;
  }

  getById(numeroID) {
    let listaProductos = this.getAll();
    let producto;
    listaProductos.forEach((element) => {
      if (element.id == numeroID) producto = element;
    });
    if (producto) {
      return producto;
    } else {
      console.log("No existe un producto con el número de ID: " + numeroID);
    }
  }

  deleteById(numeroID) {
    let listaProductos = this.getAll();
    let indexDelProductoAEliminar;
    listaProductos.forEach((element, ind) => {
      if (element.id == numeroID) indexDelProductoAEliminar = ind;
    });
    //Chequeo que haya coincidencia de ID y que el array tenga más de un elemento para usar splice
    if (indexDelProductoAEliminar != undefined && listaProductos.length > 1) {
      //Creo la nueva lista sin el producto seleccionado
      listaProductos.splice(indexDelProductoAEliminar, 1);
      let nuevaListaProductosJSON = JSON.stringify(listaProductos);
      try {
        fs.writeFileSync(
          __dirname + "/listaProductos.json",
          nuevaListaProductosJSON
        );
      } catch (err) {
        console.log(
          "Hubo un error al intentar reescribir el archivo en deleteById(): " +
            err
        );
      }
    } else if (
      indexDelProductoAEliminar != undefined &&
      listaProductos.length == 1
    ) {
      this.deleteAll();
    } else {
      console.log(
        `El producto con el ID ${numeroID} no existe en nuestra base de datos`
      );
    }
    return indexDelProductoAEliminar ? true : false;
  }

  deleteAll() {
    fs.writeFileSync(__dirname + "/listaProductos.json", "");
  }
}

module.exports = Contenedor;
