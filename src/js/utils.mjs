export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

// Update the cart icon with the number of products currently in the cart.
export function updateCartCount() {
  // Retrieve the cart from localStorage.
  const cartItems = getLocalStorage('so-cart') || [];

  // Find the cart container in the page header.
  const cartElement = document.querySelector('.cart');

  // Stop if this page does not contain a cart icon.
  if (!cartElement) {
    return;
  }

  // Look for an existing cart-count badge.
  let cartCount = cartElement.querySelector('.cart-count');

  // Create the badge if it does not already exist.
  if (!cartCount) {
    cartCount = document.createElement('span');
    cartCount.classList.add('cart-count');

    // Add the badge to the cart container.
    cartElement.appendChild(cartCount);
  }

  // Display the number of products currently in the cart.
  cartCount.textContent = cartItems.length;

  // Hide the badge when the cart is empty.
  cartCount.hidden = cartItems.length === 0;
}