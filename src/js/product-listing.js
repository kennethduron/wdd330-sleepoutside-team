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

function hideMessage() {
  const messageElement = document.querySelector('#product-listing-message');
  messageElement.textContent = '';
  messageElement.hidden = true;
}

function setupProductSearch(productList) {
  const form = document.querySelector('#product-search-form');
  const input = document.querySelector('#product-search-input');
  const clearButton = document.querySelector('#clear-product-search');

  function updateResults() {
    const query = input.value.trim();
    const results = productList.search(query);

    productList.renderList(results);

    if (query && results.length === 0) {
      showMessage(`No products found for "${query}".`);
    } else {
      hideMessage();
    }
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    updateResults();
  });

  input.addEventListener('input', updateResults);

  clearButton.addEventListener('click', () => {
    input.value = '';
    updateResults();
    input.focus();
  });
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
      return;
    }

    setupProductSearch(productList);
  } catch (error) {
    showMessage('Unable to load products. Please try again later.');
  }
}

loadHeaderFooter();
init();
