const baseURL =
  import.meta.env.VITE_SERVER_URL ||
  'https://wdd330-backend-osp8.onrender.com/';

async function convertToJson(response) {
  const responseText = await response.text();
  let responseBody = null;

  if (responseText) {
    try {
      responseBody = JSON.parse(responseText);
    } catch {
      responseBody = responseText;
    }
  }

  if (!response.ok) {
    throw {
      name: 'servicesError',
      message: responseBody || `Request failed with status ${response.status}.`,
      status: response.status,
    };
  }

  return responseBody;
}

export default class ExternalServices {
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

  async checkout(payload) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(this.getUrl('checkout'), options);

    return convertToJson(response);
  }
}
