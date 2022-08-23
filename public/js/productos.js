//Cargo la lista de productos actualizada cuando entro a la página
window.addEventListener("load", productsCardLoad());

function productsCardLoad() {
  fetch("/api/productos")
    .then((res) => res.json())
    .then((productos) => {
      let html = productos.reduce(
        (html, item) =>
          `<div class='productCards'>
          <img src=${item.thumbnail} alt="" /><div class="productCards__info"><h4 class="productCards__title">${item.title}</h4><p class='productCards__price'>$${item.price}</p><p class='productCards__description'>${item.description}</p></div><button class="productCards__button" onclick="addToCart()">Añadir al carrito</button>
      </div>` + html,
        ""
      );
      document.getElementById("productCards__container").innerHTML = html;
    });
}

function addToCart() {
  return null;
}
