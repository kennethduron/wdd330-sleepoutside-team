import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

// Creates a data source for tent products.
const dataSource = new ProductData('tents');

// Selects the HTML element where the product cards will be displayed.
const listElement = document.querySelector('.product-list');

// Creates a ProductList instance.
// We pass in the category, data source, and HTML output element.
const productList = new ProductList('tents', dataSource, listElement);

// Initializes the product list and retrieves the product data.
productList.init();
