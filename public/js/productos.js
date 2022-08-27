//Cargo la lista de productos actualizada cuando entro a la página
window.addEventListener("load", getCartId);
window.addEventListener("load", productsCardLoad);

let cartId;

function getCartId() {
  const carritoId = localStorage.id;
  if (carritoId) {
    cartId = carritoId;
  } else {
    //Si no existe un id en el localStorage, le pido al servidor que me devuelva uno
    fetch("/api/carrito", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body:"",
    })
      .then((response) => response.json())
      .then((data) => {
        cartId = data.id;
        localStorage.setItem("id", cartId);
      });
  }
}

function productsCardLoad() {
  fetch("/api/productos")
    .then((res) => res.json())
    .then((productos) => {
      let html = productos.reduce(
        (html, item) =>
          `<div class='productCards'>
          <img src=${item.thumbnail} alt="" /><div class="productCards__info"><h4 class="productCards__title">${item.title}</h4><p class="productCards__id">${item.id}</p><p class='productCards__price'>$${item.price}</p><p class='productCards__description'>${item.description}</p></div><button class="productCards__button">Añadir al carrito</button>
      </div>` + html,
        ""
      );
      document.getElementById("productCards__container").innerHTML = html;
    })
    .then(() => {
      //Agrego el event listener a los botones una vez que haya cargado todo el contenido
      let addToCartButtons = document.querySelectorAll(".productCards__button");
      addToCartButtons.forEach((element) =>
        element.addEventListener("click", (event) => addToCart(event))
      );
    });
}

function addToCart(event) {
  if (cartId) {
    const productId =
      event.target.parentNode.querySelector(".productCards__id").innerHTML;
    fetch(`/api/carrito/${productId}/productos`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ cartId: cartId }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data.message));
  } else {
    console.log("Necesitas un Id de carrito para agregar productos al carrito");
  }
}
