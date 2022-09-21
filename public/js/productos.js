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
    })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        cartId = data.id;
        localStorage.setItem("id", cartId);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function productsCardLoad() {
  fetch("/api/productos")
    .then((res) => {
      if (!res.ok) throw Error(res.statusText);
      return res.json();
    })
    .then((data) => {
      let html = data.products.reduce(
        (html, item) =>
          `<div class='productCards' id=${item._id}>
          <img src=${item.thumbnail} alt="" /><div class="productCards__info"><h4 class="productCards__title">${item.title}</h4><p class='productCards__price'>$${item.price}</p><p class='productCards__description'>${item.description}</p></div><button class="productCards__button">Añadir al carrito</button>
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
    })
    .catch((err) => {
      console.log(err);
    });
}

function addToCart(event) {
  if (cartId) {
    const productId = event.target.parentNode.id;
    fetch(`/api/carrito/${productId}/productos`, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ cartId }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data.message));
  } else {
    console.log("Necesitas un Id de carrito para agregar productos al carrito");
  }
}
