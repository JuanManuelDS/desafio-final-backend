const addForm = `<div id="addProductForm">
Título<br /><input type="text" id="product__title" name="product__title" required><br />
Autor<br /><input type="text" id="product__author" name="product__author" required><br />
Precio<br /><input type="text" id="product__price" name="product__price" required><br />
Descripción<br /><input type="text" id="product__description" name="product__description" required><br />
URL de imágen<br /><input type="text" id="product__imageURL" name="product__imageURL" required><br />
Stock<br /><input type="text" id="product__stock" name="product__stock" required><br />
<button onclick="addProduct()">Añadir producto</button>
</div>`;

const getByIdForm = `<div id="getByIdform">
Ingrese el ID del producto: <br><input type="text" id="productId" name="productId"><br>
<button onclick="getById()">Buscar</button>
</div>`;

const deleteForm = `<div id="deleteForm">
Ingrese el id del producto a eliminar: <br><input type="text" id="productId" name="productId"><br>
<button onclick="deleteById()">Eliminar</button>
</div>`;

const modifyProductForm = `<div id="modifyProductForm">
ID del producto a modificar <br><input type="text" name="productId" id="productId"><br>
Nuevo título <br><input type="text" name="productTitle" id="productTitle"><br>
Nuevo autor<br /><input type="text" id="productAuthor" name="productAuthor" required><br />
Nueva descripción <br><input type="text" name="productDescription" id="productDescription"><br>
Nuevo precio <br><input type="text" name="productPrice" id="productPrice"><br>
Nueva imagen <br><input type="text" name="productImage" id="productImage"><br>
Stock <br><input type="text" name="productStock" id="productStock"><br>
<button onclick="modifyProduct()">Modificar</button>
</div>`;

let isAdmin = false;

function adminLogin() {
  isAdmin = true;
}

function showAddForm() {
  document.getElementById("index__forms").innerHTML = addForm;
  document.getElementById("index__results").innerHTML = "";
}

function showGetByIdForm() {
  document.getElementById("index__forms").innerHTML = getByIdForm;
  document.getElementById("index__results").innerHTML = "";
}

function showDeleteForm() {
  if (isAdmin) {
    document.getElementById("index__results").innerHTML = "";
    document.getElementById("index__forms").innerHTML = deleteForm;
  } else {
    document.getElementById("index__results").innerHTML =
      "Necesitas ser administrador para eliminar productos";
  }
}

function showModifyProductForm() {
  if (isAdmin) {
    document.getElementById("index__results").innerHTML = "";
    document.getElementById("index__forms").innerHTML = modifyProductForm;
  } else {
    document.getElementById("index__results").innerHTML =
      "Necesitas ser admin para modificar productos";
  }
}

function addProduct() {
  const title = document.getElementById("product__title").value;
  const author = document.getElementById("product__author").value;
  const price = document.getElementById("product__price").value;
  const description = document.getElementById("product__description").value;
  const thumbnail = document.getElementById("product__imageURL").value;
  const stock = document.getElementById("product__stock").value;
  const productoPorAgregar = {
    title,
    author,
    price,
    description,
    thumbnail,
    stock,
  };

  fetch("api/productos", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(productoPorAgregar),
  })
    .then((res) => {
      if (!res.ok) throw Error(res.statusText);

      document.getElementById(
        "index__results"
      ).innerHTML = ` <h3>${res.statusText}</h3>`;
      document.getElementById("index__forms").innerHTML = "";
    })
    .catch((error) => {
      document.getElementById("index__results").innerHTML = `<h3>${error}</h3>`;
    });
}

function deleteById() {
  const id = document.getElementById("productId").value;
  fetch(`api/productos/${id}`, {
    method: "DELETE",
    headers: { "Content-type": "application/json" },
  })
    .then((response) => {
      if (!response.ok) throw Error(response.statusText);

      document.getElementById(
        "index__results"
      ).innerHTML = `<h3>${response.statusText}</h3>`;
      document.getElementById("index__forms").innerHTML = "";
    })
    .catch(
      (error) =>
        (document.getElementById(
          "index__results"
        ).innerHTML = `<h3>${error}</h3>`)
    );
}

function getById() {
  const id = document.getElementById("productId").value;
  fetch(`api/productos/${id}`)
    .then((res) => {
      if (!res.ok) throw Error(response.statusText);
      return res.json();
    })
    .then((data) => {
      document.getElementById(
        "index__results"
      ).innerHTML = `<div class='productCards'>
      <img src=${data.product.thumbnail} alt="" /><div class="productCards__info"><h4 class="productCards__title">${data.product.title}</h4><p class='productCards__price'>$${data.product.price}</p><p class='productCards__description'>${data.product.description}</p></div><button class="productCards__button" onclick="addToCart()">Añadir al carrito</button>
      </div>`;
      document.getElementById("index__forms").innerHTML = "";
    })
    .catch((err) => {
      document.getElementById("index__results").innerHTML = `<h3>${err}</h3>`;
    });
}

function modifyProduct() {
  const productId = document.getElementById("productId").value;
  const title = document.getElementById("productTitle").value;
  const author = document.getElementById("productAuthor").value;
  const price = document.getElementById("productPrice").value;
  const description = document.getElementById("productDescription").value;
  const thumbnail = document.getElementById("productImage").value;
  const stock = document.getElementById("productStock").value;
  const newProductInfo = {
    title,
    author,
    price,
    description,
    thumbnail,
    stock,
  };

  fetch(`/api/productos/${productId}`, {
    method: "PUT",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(newProductInfo),
  })
    .then((res) => {
      if (!res.ok) throw Error(res.statusText);

      document.getElementById(
        "index__results"
      ).innerHTML = ` <h3>${res.statusText}</h3>`;
      document.getElementById("index__forms").innerHTML = "";
    })
    .catch((err) => {
      document.getElementById("index__results").innerHTML = `<h3>${err}</h3>`;
    });
}
