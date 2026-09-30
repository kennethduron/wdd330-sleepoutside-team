// wishlist.mjs
// Wish list feature for Sleep Outside.
// Stores saved products in localStorage under WISHLIST_KEY.

const WISHLIST_KEY = 'so-wishlist';
const CART_KEY = 'so-cart';

/** Read a JSON array from localStorage, returning [] on any problem. */
function readList(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key));
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
}

function writeList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

/** @returns {Array} every product in the wish list */
export function getWishlist() {
  return readList(WISHLIST_KEY);
}

/** @returns {boolean} true when the product id is already saved */
export function isInWishlist(id) {
  return getWishlist().some((item) => item.Id === id);
}

/**
 * Save a product. Duplicates are ignored.
 * @returns {boolean} true if added, false if it was already there
 */
export function addToWishlist(product) {
  const list = getWishlist();
  if (list.some((item) => item.Id === product.Id)) {
    return false;
  }
  list.push(product);
  writeList(WISHLIST_KEY, list);
  updateWishlistCount();
  return true;
}

export function removeFromWishlist(id) {
  const list = getWishlist().filter((item) => item.Id !== id);
  writeList(WISHLIST_KEY, list);
  updateWishlistCount();
}

/** Update any element with id wishlist-count in the header. */
export function updateWishlistCount() {
  const badge = document.querySelector('#wishlist-count');
  if (!badge) return;
  const count = getWishlist().length;
  badge.textContent = count > 0 ? String(count) : '';
}

/** Move an item from the wish list into the cart. */
function moveToCart(product) {
  const cart = readList(CART_KEY);
  cart.push(product);
  writeList(CART_KEY, cart);
}

/**
 * Wire up the heart button on a product detail page.
 * @param {HTMLButtonElement} button the wish list button
 * @param {object} product the product currently displayed
 */
export function setupWishlistButton(button, product) {
  const refresh = () => {
    const saved = isInWishlist(product.Id);
    button.textContent = saved
      ? '\u2665 In your wish list'
      : '\u2661 Add to wish list';
    button.setAttribute('aria-pressed', String(saved));
  };
  button.addEventListener('click', () => {
    if (isInWishlist(product.Id)) {
      removeFromWishlist(product.Id);
    } else {
      addToWishlist(product);
    }
    refresh();
  });
  refresh();
}

/** Build one wish list card using DOM methods (no innerHTML). */
function buildCard(product, onChange) {
  const card = document.createElement('li');
  card.className = 'wishlist-card';

  const link = document.createElement('a');
  link.href = `../product_pages/?product=${product.Id}`;
  const img = document.createElement('img');
  img.src =
    product.Images?.PrimaryMedium ||
    product.Images?.PrimaryLarge ||
    product.Image ||
    '';
  img.alt = product.Name || 'Product';
  link.appendChild(img);

  const title = document.createElement('h3');
  title.textContent = product.NameWithoutBrand || product.Name || 'Product';

  const price = document.createElement('p');
  price.className = 'wishlist-price';
  price.textContent = product.FinalPrice ? `$${product.FinalPrice}` : '';

  const cartBtn = document.createElement('button');
  cartBtn.type = 'button';
  cartBtn.textContent = 'Add to cart';
  cartBtn.addEventListener('click', () => {
    moveToCart(product);
    cartBtn.textContent = 'Added!';
    cartBtn.disabled = true;
  });

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'wishlist-remove';
  removeBtn.textContent = 'Remove';
  removeBtn.addEventListener('click', () => {
    removeFromWishlist(product.Id);
    onChange();
  });

  card.append(link, title, price, cartBtn, removeBtn);
  return card;
}

/** Render the full wish list into a container element. */
export function renderWishlist(container) {
  const list = getWishlist();
  container.replaceChildren();

  if (list.length === 0) {
    const empty = document.createElement('p');
    empty.textContent =
      'Your wish list is empty. Browse products and tap the heart to save items.';
    container.appendChild(empty);
    return;
  }

  const ul = document.createElement('ul');
  ul.className = 'wishlist-grid';
  list.forEach((product) => {
    ul.appendChild(buildCard(product, () => renderWishlist(container)));
  });
  container.appendChild(ul);
}
