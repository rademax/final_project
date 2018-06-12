let products = document.getElementsByClassName('products')[1];
//
//   constructor (prop) {
//     this.id = prop.id;
//     this.dateAdded = prop.dateAdded;
//     this.title = prop.title;
//     this.description = prop.description;
//     this.placeholder = prop.placeholder;
//     this.discountedPrice = prop.discountedPrice;
//     this.price = prop.price;
//     this.hasNew = prop.hasNew;
//     this.category = prop.category;
//     this.fashion = prop.fashion;
//     this.colors = prop.colors;
//     this.sizes = prop.sizes;
//     this.thumbnail = prop.thumbnail;
//     this.preview = prop.preview;
//   }

function formProductItem(product) {
  let templateCard = `
    <div class="products__item">
        <div class="products__img">
            <img src="img/new_products/product1.jpg" alt="${product.title}">
            <div class="products__hover"><a href="item.html" class="products__hover-link">View item</a></div>
        </div>
        ${hasNew(product.hasNew)}
        <div class="products__item-title">
            <a class="products__link" href="item.html">${product.title}</a>
        </div>
        <div class="products__price">
            ${hasDiscount(product.price, product.discountedPrice)}
        </div>
    </div>
    `;
  return templateCard;
}

function hasDiscount(price, discountedPrice) {
  if(price !== discountedPrice) {
    let discount = ((price - discountedPrice) / price) * 100;
    return `
      <div class="products__old-price">£${price}</div>
      <div class="products__discount">${discount}%</div>
      <div class="products__current-price">£${discountedPrice}</div>
    `;
  }
  return `<div class="products__current-price">£${price}</div>`;
}

function hasNew(hasNew) {
  if(hasNew) {
    return `<div class="products__label">New</div>`;
  }
  return '';
}

function addProductsOnPage(products = catalog) {
  let productsList = document.createElement("div");
  productsList.classList.add("products__list");
  for(let i = 0; i < products.length; i++) {
    let product = products[i];
    productsList.innerHTML += formProductItem(product);
  }

  products.appendChild(productsList);
}

addProductsOnPage();
