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

export function renderWithTemplate(template, parentElement, data, callback) {
  if (!parentElement) {
    return;
  }

  parentElement.innerHTML = template;

  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const response = await fetch(path);

  if (!response.ok) {
    console.error(
      `Failed to load template from ${path}: ${response.status} ${response.statusText}`,
    );
    throw new Error(`Template load failed for ${path}`);
  }

  return response.text();
}

export async function loadHeaderFooter() {
  const renderTemplates = async () => {
    try {
      const [headerTemplate, footerTemplate] = await Promise.all([
        loadTemplate('/partials/header.html'),
        loadTemplate('/partials/footer.html'),
      ]);

      const headerElement = document.querySelector('#main-header');
      const footerElement = document.querySelector('#main-footer');

      if (headerElement) {
        renderWithTemplate(headerTemplate, headerElement, null, updateCartCount);
      } else {
        console.warn('Header placeholder #main-header was not found.');
      }

      if (footerElement) {
        renderWithTemplate(footerTemplate, footerElement);
      } else {
        console.warn('Footer placeholder #main-footer was not found.');
      }
    } catch (error) {
      console.error('Unable to load header and footer partials.', error);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderTemplates, {
      once: true,
    });
    return;
  }

  await renderTemplates();
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
