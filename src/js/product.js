// Import utility functions used by the product page.
import { getParam, loadHeaderFooter } from "./utils.mjs";

// Import the product data source.
import ProductData from "./ProductData.mjs";

// Import the class used to display the selected product.
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter();

// Retrieve the product ID from the URL.
const productId = getParam("product");

// Create the product data source.
const dataSource = new ProductData();

// Create the product details object for the selected product.
const product = new ProductDetails(productId, dataSource);

// Load and display the selected product.
product.init();
