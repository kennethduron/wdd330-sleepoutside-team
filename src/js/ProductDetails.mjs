import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);

    if (!this.product) {
      document.querySelector(".product-detail").textContent =
        "Product not found.";
      return;
    }

    this.renderProductDetails();
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getLocalStorage("so-cart") || [];
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    const productDetail = document.querySelector(".product-detail");
    const price = Number(this.product.FinalPrice).toFixed(2);

    document.title = `Sleep Outside | ${this.product.Name}`;
    productDetail.querySelector('[data-product="brand"]').textContent =
      this.product.Brand.Name;
    productDetail.querySelector('[data-product="name"]').textContent =
      this.product.NameWithoutBrand;

    const image = productDetail.querySelector('[data-product="image"]');
    image.src = this.product.Image;
    image.alt = this.product.Name;

    productDetail.querySelector('[data-product="price"]').textContent =
      `$${price}`;
    productDetail.querySelector('[data-product="color"]').textContent =
      this.product.Colors[0].ColorName;
    productDetail.querySelector('[data-product="description"]').innerHTML =
      this.product.DescriptionHtmlSimple;

    const addToCart = document.getElementById("addToCart");
    addToCart.dataset.id = this.product.Id;
  }
}