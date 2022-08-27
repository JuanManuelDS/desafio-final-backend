window.addEventListener("load", loadCarrito);
document
  .getElementById("deleteAll__button")
  .addEventListener("click", vaciarCarrito);

function loadCarrito() {
  let cartId = localStorage.id;
  fetch(`api/carrito/${cartId}/productos`)
    .then((response) => response.json())
    .then((data) => {
      let productos = JSON.parse(data.productos);
      let html = productos.reduce(
        (html, item) =>
          `<div class='products__cart'>
              <img src=${item.thumbnail} alt="" /><div class="productsCart__info"><h4 class="productsCart__title">${item.title}</h4><p class="productsCart__id">${item.id}</p><p class='productsCart__price'>$${item.price}</p><p class='productsCart__description'>${item.description}</p></div><button class="productsCart__delete">Eliminar</button>
          </div>` + html,
        ""
      );
      document.getElementById("productsCart__container").innerHTML = html;
    })
    .then(() => {
      let deleteButtonsEvent = document.querySelectorAll(
        ".productsCart__delete"
      );
      deleteButtonsEvent.forEach((element) =>
        element.addEventListener("click", (event) => deleteProduct(event))
      );
    });
}

function deleteProduct(event) {
  let productId =
    event.target.parentNode.querySelector(".productsCart__id").innerHTML;
  let cartId = localStorage.id;
  fetch(`/api/carrito/${cartId}/productos/${productId}`, {
    method: "DELETE",
    headers: { "Content-type": "application/json" },
    body: "",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.deleted) {
        loadCarrito();
      }
    });
}

function vaciarCarrito() {
  let cartId = localStorage.id;
  fetch(`/api/carrito/${cartId}`, {
    method: "DELETE",
    headers: { "Content-type": "application/json" },
    body: "",
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success == "ok") {
        localStorage.removeItem("id");
        location.href = "/productos";
      }
    });
}
