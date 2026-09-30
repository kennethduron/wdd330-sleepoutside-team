import ExternalServices from './ExternalServices.mjs';
import {
  alertMessage,
  getLocalStorage,
  setLocalStorage,
  updateCartCount,
} from './utils.mjs';

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

function getErrorMessage(error) {
  const message = error?.message ?? error;

  if (Array.isArray(message)) {
    return message.map(getErrorMessage).join(' ');
  }

  if (message && typeof message === 'object') {
    const detail = message.message || message.error || message.Message;

    if (detail) {
      return getErrorMessage(detail);
    }

    const nestedMessages = Object.values(message)
      .map(getErrorMessage)
      .filter(Boolean);

    if (nestedMessages.length > 0) {
      return nestedMessages.join(' ');
    }

    return 'Unable to submit your order. Please review your information and try again.';
  }

  return String(message || 'Unable to submit your order. Please try again.');
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

    try {
      const response = await this.services.checkout(order);

      setLocalStorage(this.key, []);
      updateCartCount();
      window.location.assign('/checkout/success.html');

      return response;
    } catch (error) {
      this.lastError = error;
      alertMessage(getErrorMessage(error), false);
      // Keep the structured backend response available for diagnosis.
      // eslint-disable-next-line no-console
      console.error('Checkout submission failed.', error);
      return null;
    }
  }
}
