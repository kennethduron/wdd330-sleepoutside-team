import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

const dataSource = new ProductData('tents');
const listElement = document.querySelector('.product-list');
const productList = new ProductList('tents', dataSource, listElement);

productList.init(['880RR', '985RF', '985PR', '344YJ']);
