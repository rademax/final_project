let productsHtml = document.getElementsByClassName('products')[0];
let productsCountGlobal = performProductsCount();

function formProductItem(product) {
  return `
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
  let productsCountOnRow = performProductsCount();
  productsList.classList.add("products__list");
  for(let i = 0; i < products.length; i++) {
    let product = products[i];
    if(i === productsCountOnRow) {
      productsList.innerHTML += addPromoBanner();
    }
    productsList.innerHTML += formProductItem(product);
  }
  productsHtml.appendChild(productsList);
  productsHtml.innerHTML += addShowMoreButton();
}

function addShowMoreButton() {
  return `<a class="btn products__all-products" href="#">Show more</a>`;
}

function performProductsCount() {
  let clientWidth = checkClientWidth();
  let productsCountOnRow = 4;
  if(clientWidth >= 768 &&  clientWidth < 1024) {
    productsCountOnRow = 3;
  }
  else if(clientWidth < 768) {
    productsCountOnRow = 2;
  }
  return productsCountOnRow;
}

function checkClientWidth() {
  return window.innerWidth;
}

function addPromoBanner() {
  return `
    <section class="promo wrap">
      <div class="promo__title">Last weekend <span>extra 50%</span> off on all reduced boots and shoulder bags</div>
      <div class="promo__description">This offer is valid in-store and online. Prices displayed reflect this additional discount. This offer ends at 11:59 GMT on March 1st 2015</div>
    </section>
  `;
}

addProductsOnPage();

window.addEventListener("resize", function () {
  let addBanner = checkProductsCountChanges();
  if(addBanner) {
    clearProductsFromPage();
    addProductsOnPage();
  }
});

function clearProductsFromPage() {
  productsHtml.innerHTML = '';
}

function checkProductsCountChanges() {
  let productsCount = performProductsCount();
  if(productsCount !== productsCountGlobal) {
    productsCountGlobal = productsCount;
    return true;
  }
  return false;
}
