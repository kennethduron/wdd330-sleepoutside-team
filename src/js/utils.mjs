// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// Render a list of items using a supplied template function.
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = 'afterbegin',
  clear = false,
) {
  // Clears the existing content if requested.
  if (clear) {
    parentElement.innerHTML = '';
  }

  // Converts each item in the list into an HTML string.
  const htmlStrings = list.map(templateFn);

  // Inserts the generated HTML into the parent element.
  parentElement.insertAdjacentHTML(
    position,
    htmlStrings.join(''),
  );
}