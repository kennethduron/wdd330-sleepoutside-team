import { loadHeaderFooter } from './utils.mjs';
import { renderWishlist, updateWishlistCount } from './wishlist.mjs';

async function initWishlistPage() {
  await loadHeaderFooter();
  renderWishlist(document.querySelector('#wishlist-container'));
  updateWishlistCount();
}

initWishlistPage();
