import { setLocalStorage, getLocalStorage, updateCartCount } from './utils.mjs';
import { setupWishlistButton } from './wishlist.mjs'; // NEW

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    const productDetail = document.querySelector('.product-detail');

    try {
      this.product = await this.dataSource.findProductById(this.productId);

      if (!this.product) {
        productDetail.textContent = 'Product not found.';
        return;
      }

      this.renderProductDetails();
      document
        .getElementById('addToCart')
        .addEventListener('click', this.addProductToCart.bind(this));
      this.addWishlistButton(); // NEW
    } catch (error) {
      console.error('Unable to load product details.', error);
      productDetail.textContent =
        'Unable to load this product. Please try again.';
    }
  }

  addProductToCart() {
    const cartItems = getLocalStorage('so-cart') || [];
    cartItems.push(this.product);
    setLocalStorage('so-cart', cartItems);

    updateCartCount();
  }

  // NEW: creates the wish list button right after the Add to Cart button
  addWishlistButton() {
    const addToCart = document.getElementById('addToCart');
    const button = document.createElement('button');
    button.type = 'button';
    button.id = 'wishlistBtn';
    button.className = 'wishlist-btn';
    addToCart.insertAdjacentElement('afterend', button);
    setupWishlistButton(button, this.product);
  }

  renderProductDetails() {
    const productDetail = document.querySelector('.product-detail');

    const finalPrice = Number(this.product.FinalPrice);
    const suggestedRetailPrice = Number(this.product.SuggestedRetailPrice);
    const price = finalPrice.toFixed(2);

    const hasDiscount =
      Number.isFinite(finalPrice) &&
      Number.isFinite(suggestedRetailPrice) &&
      suggestedRetailPrice > 0 &&
      finalPrice < suggestedRetailPrice;

    document.title = `Sleep Outside | ${this.product.Name}`;
    productDetail.querySelector('[data-product="brand"]').textContent =
      this.product.Brand?.Name || this.product.Brand || '';
    productDetail.querySelector('[data-product="name"]').textContent =
      this.product.NameWithoutBrand;

    const image = productDetail.querySelector('[data-product="image"]');
    image.src = this.product.Images?.PrimaryLarge || this.product.Image;
    image.alt = this.product.Name;

    const priceElement = productDetail.querySelector('[data-product="price"]');

    if (hasDiscount) {
      const discountPercentage = Math.round(
        ((suggestedRetailPrice - finalPrice) / suggestedRetailPrice) * 100,
      );

      priceElement.innerHTML = `
          <span class="product-detail__original-price">
            Was <del>$${suggestedRetailPrice.toFixed(2)}</del>
          </span>
          <span class="product-detail__price">$${price}</span>
          <span class="product-detail__discount">${discountPercentage}% OFF</span>
        `;
      } else {
        priceElement.textContent = `$${price}`;
      }

    productDetail.querySelector('[data-product="color"]').textContent =
      this.product.Colors?.[0]?.ColorName || '';
    productDetail.querySelector('[data-product="description"]').innerHTML =
      this.product.DescriptionHtmlSimple;

    const addToCart = document.getElementById('addToCart');
    addToCart.dataset.id = this.product.Id;
  }
}
