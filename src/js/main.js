import { updateCartCount } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";

updateCartCount();

const dataSource = new ProductData("tents");
const listElement = document.querySelector("#productList");
const myList = new ProductList("tents", dataSource, listElement);

myList.init();
