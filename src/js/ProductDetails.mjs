import { getLocalStorage, setLocalStorage } from './utils.mjs';

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
    this.renderProductDetails();
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addToCart.bind(this));
  }

    renderProductDetails() {
    document.querySelector('#productBrand').textContent = this.product.Brand.Name;
    document.querySelector('#productNameElement').textContent = this.product.Name;

    const productImage = document.querySelector('#productImage');
    productImage.src = this.product.Image;
    productImage.alt = this.product.Name;

    document.querySelector('#productPrice').textContent = this.product.FinalPrice;
    document.querySelector('#productColor').textContent = this.product.Colors[0].ColorName;
    document.querySelector('#productDescription').innerHTML = this.product.DescriptionHtmlSimple;

    document.querySelector('#addToCart').dataset.id = this.product.Id;
  }
  
  addToCart() {
    const cartItems = getLocalStorage('so-cart') || [];
    cartItems.push(this.product);
    setLocalStorage('so-cart', cartItems);
  }
}