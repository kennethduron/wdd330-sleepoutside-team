function getBrandName(product) {
  return product.Brand?.Name || product.Brand || '';
}

function formatPrice(price) {
  return `$${Number(price).toFixed(2)}`;
}

function getDiscountPercentage(product) {
  const finalPrice = Number(product.FinalPrice);
  const suggestedRetailPrice = Number(product.SuggestedRetailPrice);

  if (
    !Number.isFinite(finalPrice) ||
    !Number.isFinite(suggestedRetailPrice) ||
    suggestedRetailPrice <= 0 ||
    finalPrice >= suggestedRetailPrice
  ) {
    return null;
  }

  return Math.round(
    ((suggestedRetailPrice - finalPrice) / suggestedRetailPrice) * 100,
  );
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

    const discountPercentage = getDiscountPercentage(product);
    const link = document.createElement('a');
    link.href = `/product_pages/?product=${encodeURIComponent(product.Id)}`;
    link.setAttribute(
      'aria-label',
      discountPercentage === null
        ? `View ${product.Name}`
        : `View ${product.Name}, ${discountPercentage}% off`,
    );

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

    if (discountPercentage !== null) {
      const originalPrice = document.createElement('p');
      originalPrice.className = 'product-card__original-price';
      originalPrice.textContent = 'Was ';

      const originalPriceValue = document.createElement('del');
      originalPriceValue.textContent = formatPrice(product.SuggestedRetailPrice);
      originalPrice.append(originalPriceValue);

      const discount = document.createElement('span');
      discount.className = 'product-card__discount';
      discount.textContent = `${discountPercentage}% OFF`;

      link.append(image, brand, name, originalPrice, price, discount);
    } else {
      link.append(image, brand, name, price);
    }

    card.append(link);

    return card;
  }
}
