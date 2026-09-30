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

  if (!checkoutForm.checkValidity()) {
    checkoutForm.reportValidity();
    return;
  }

  checkoutProcess.calculateOrderTotal();

  try {
    const response = await checkoutProcess.checkout(checkoutForm);
    // The Week 04 activity requires the checkout response to be inspectable.
    // eslint-disable-next-line no-console
    console.info('Checkout response received.', response);
  } catch (error) {
    // Keep backend failures inspectable until the next activity adds checkout UX.
    // eslint-disable-next-line no-console
    console.error('Checkout submission failed.', error);
  }
});
