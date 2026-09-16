const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(response) {
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }

  return response.json();
}

export default class ProductData {
  getUrl(path) {
    if (!baseURL) {
      throw new Error('Product API URL is not configured.');
    }

    return `${baseURL}${path}`;
  }

  async getData(category) {
    const response = await fetch(this.getUrl(`products/search/${category}`));
    const data = await convertToJson(response);

    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(this.getUrl(`product/${id}`));
    const data = await convertToJson(response);

    return data.Result;
  }
}
