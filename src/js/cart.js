import {
  getLocalStorage,
  setLocalStorage,
  loadHeaderFooter,
  updateCartCount,
} from './utils.mjs';

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];
  const cartList = document.querySelector('.product-list');

  if (cartItems.length === 0) {
    cartList.innerHTML = '<li class="cart-empty">Your cart is empty.</li>';
    return;
  }

  const htmlItems = cartItems.map((item, index) =>
    cartItemTemplate(item, index),
  );
  cartList.innerHTML = htmlItems.join('');
  addRemoveListeners();
}

function removeItemFromCart(e) {
  const itemIndex = Number(e.currentTarget.dataset.index);
  const cartItems = getLocalStorage('so-cart') || [];

  if (!Number.isInteger(itemIndex) || itemIndex < 0 || itemIndex >= cartItems.length) {
    return;
  }

  cartItems.splice(itemIndex, 1);
  setLocalStorage('so-cart', cartItems);
  renderCartContents();
  updateCartCount();
}

function addRemoveListeners() {
  const removeButtons = document.querySelectorAll('.cart-card__remove');
  removeButtons.forEach((button) => {
    button.addEventListener('click', removeItemFromCart);
  });
}

function cartItemTemplate(item, index) {
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
  <button
    type="button"
    class="cart-card__remove"
    data-index="${index}"
    aria-label="Remove ${item.Name} from cart"
  >
    ×
  </button>
</li>`;

  return newItem;
}

loadHeaderFooter();

// Display the products currently stored in the cart.
renderCartContents();
