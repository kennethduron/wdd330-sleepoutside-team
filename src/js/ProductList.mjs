// ProductList.mjs

// Import the reusable list rendering utility.
import { renderListWithTemplate } from './utils.mjs';

// Create the HTML markup for one product card.
function productCardTemplate(product) {
  return `
    <li class="product-card">
      <a href="product_pages/?product=${product.Id}">
        <img
          src="${product.Image}"
          alt="${product.NameWithoutBrand}"
        />
        <h3 class="card__brand">${product.Brand.Name}</h3>
        <h2 class="card__name">${product.NameWithoutBrand}</h2>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
    </li>
  `;
}

// This class is responsible for retrieving a list of products
// and eventually displaying those products on the page.
export default class ProductList {
  constructor(category, dataSource, listElement) {
    // Saves the product category, such as 'tents'.
    this.category = category;

    // Saves the object responsible for retrieving our product data.
    this.dataSource = dataSource;

    // Saves the HTML element where the products will be displayed.
    this.listElement = listElement;
  }

  async init() {
    // getData() returns a Promise, so await waits until
    // the product data has been returned.
    const list = await this.dataSource.getData();

    // Render the products on the page.
    this.renderList(list);
  }

  renderList(list) {
    // Use the reusable utility function to generate
    // and insert the product cards into the page.
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
    );
  }
}