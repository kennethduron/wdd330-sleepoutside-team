import ExternalServices from './ExternalServices.mjs';
import { getLocalStorage } from './utils.mjs';

function getQuantity(item) {
  const quantity = Number(item.quantity ?? item.Quantity ?? 1);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
}

function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: getQuantity(item),
  }));
}

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
    this.services = new ExternalServices();
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
  }

  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce(
      (total, item) => total + Number(item.FinalPrice) * getQuantity(item),
      0,
    );

    const subtotal = document.querySelector(
      `${this.outputSelector} #subtotal`,
    );

    subtotal.textContent = `$${this.itemTotal.toFixed(2)}`;
  }

  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
    const itemCount = this.list.reduce(
      (total, item) => total + getQuantity(item),
      0,
    );

    if (itemCount > 0) {
      this.shipping = 10 + (itemCount - 1) * 2;
    } else {
      this.shipping = 0;
    }

    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const tax = document.querySelector(`${this.outputSelector} #tax`);
    const shipping = document.querySelector(
      `${this.outputSelector} #shipping`,
    );
    const orderTotal = document.querySelector(
      `${this.outputSelector} #order-total`,
    );

    tax.textContent = `$${this.tax.toFixed(2)}`;
    shipping.textContent = `$${this.shipping.toFixed(2)}`;
    orderTotal.textContent = `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    const order = formDataToJSON(form);

    order.orderDate = new Date().toISOString();
    order.items = packageItems(this.list);
    order.orderTotal = this.orderTotal.toFixed(2);
    order.shipping = this.shipping;
    order.tax = this.tax.toFixed(2);

    return this.services.checkout(order);
  }
}
