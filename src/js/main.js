import { loadHeaderFooter } from './utils.mjs';

loadHeaderFooter();

function handleNewsletterSignup(e) {
  e.preventDefault();
  const emailInput = document.querySelector('#newsletterEmail');
  const message = document.querySelector('#newsletterMessage');

  emailInput.value = '';
  message.hidden = false;
}

const newsletterForm = document.querySelector('#newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', handleNewsletterSignup);
}
