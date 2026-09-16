function getBrandName(product) {
  return product.Brand?.Name || product.Brand || '';
}

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const products = await this.dataSource.getData(this.category);

    if (!Array.isArray(products)) {
      throw new Error('The product list response was invalid.');
    }

    this.renderList(products);
    return products.length;
  }

  renderList(products) {
    const cards = products.map((product) => this.createProductCard(product));
    this.listElement.replaceChildren(...cards);
  }

  createProductCard(product) {
    const card = document.createElement('li');
    card.className = 'product-card';

    const link = document.createElement('a');
    link.href = `/product_pages/?product=${encodeURIComponent(product.Id)}`;
    link.setAttribute('aria-label', `View ${product.Name}`);

    const image = document.createElement('img');
    image.src = product.Images?.PrimaryMedium || '';
    image.alt = product.Name;
    image.loading = 'lazy';

    const brand = document.createElement('h3');
    brand.className = 'card__brand';
    brand.textContent = getBrandName(product);

    const name = document.createElement('h2');
    name.className = 'card__name';
    name.textContent = product.NameWithoutBrand || product.Name;

    const price = document.createElement('p');
    price.className = 'product-card__price';
    price.textContent = formatPrice(product.FinalPrice);

    link.append(image, brand, name, price);
    card.append(link);

    return card;
  }
}
