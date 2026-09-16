import { getLocalStorage, loadHeaderFooter } from './utils.mjs';

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');
}

function cartItemTemplate(item) {
  const image = item.Images?.PrimaryMedium || item.Image;
  const color = item.Colors?.[0]?.ColorName || '';
  const newItem = `<li class="cart-card divider">
  <a href="../product_pages/?product=${item.Id}" class="cart-card__image">
    <img
      src="${image}"
      alt="${item.Name}"
    />
  </a>
  <a href="../product_pages/?product=${item.Id}">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${color}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

loadHeaderFooter();

// Display the products currently stored in the cart.
renderCartContents();
