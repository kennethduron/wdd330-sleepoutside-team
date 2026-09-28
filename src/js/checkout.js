import { loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

loadHeaderFooter();

const checkoutProcess = new CheckoutProcess('so-cart', '.order-summary');
checkoutProcess.init();

const zip = document.querySelector('#zip');
const checkoutForm = document.querySelector('#checkout-form');

zip.addEventListener('blur', () => {
  if (zip.value.trim() !== '') {
    checkoutProcess.calculateOrderTotal();
  }
});

checkoutForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  checkoutProcess.calculateOrderTotal();

  await checkoutProcess.checkout(checkoutForm);
});