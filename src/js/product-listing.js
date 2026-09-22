import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';
import { getParam, loadHeaderFooter } from './utils.mjs';

const categories = {
  tents: 'Tents',
  backpacks: 'Backpacks',
  'sleeping-bags': 'Sleeping Bags',
  hammocks: 'Hammocks',
};

function showMessage(message) {
  const messageElement = document.querySelector('#product-listing-message');
  messageElement.textContent = message;
  messageElement.hidden = false;
}

async function init() {
  const category = getParam('category')?.toLowerCase();
  const categoryName = categories[category];
  const heading = document.querySelector('#product-listing-title');
  const listElement = document.querySelector('.product-list');

  if (!categoryName) {
    heading.textContent = 'Top Products';
    showMessage('Select a valid product category to view products.');
    return;
  }

  heading.textContent = `Top Products: ${categoryName}`;

  try {
    const externalServices = new ExternalServices();
    const productList = new ProductList(category, externalServices, listElement);
    const productCount = await productList.init();

    if (productCount === 0) {
      showMessage(`No ${categoryName.toLowerCase()} are currently available.`);
    }
  } catch (error) {
    showMessage('Unable to load products. Please try again later.');
  }
}

loadHeaderFooter();
init();
