let productsHtml = document.getElementsByClassName('products')[0];
let productsCountGlobal = performProductsCount();

if(productsHtml) {
  addProductsOnPage();

  window.addEventListener("resize", function () {
    let addBanner = checkProductsCountChanges();
    if(addBanner) {
      clearProductsFromPage();
      addProductsOnPage();
    }
  });
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
    if(!product.price) {
      continue;
    }
    productsList.innerHTML += formProductItem(product);
  }
  productsHtml.appendChild(productsList);
  productsHtml.innerHTML += addShowMoreButton();
}

function clearProductsFromPage() {
  productsHtml.innerHTML = '';
}

function formProductItem(product) {
  return `
    <div class="products__item">
      <div class="products__img">
        <img src="img/new_products/product1.jpg" alt="${product.title}">
        <div class="products__hover"><a href="item.html?id=${product.id}" class="products__hover-link">View item</a></div>
      </div>
      ${(product.hasNew) ? hasNew() : ''}
      <div class="products__item-title">
        <a class="products__link" href="item.html?id=${product.id}">${product.title}</a>
      </div>
      <div class="products__price">
        ${addPrice(product.price, product.discountedPrice)}
      </div>
  </div>
  `;
}

function addPrice(price, discountedPrice) {
  if(price !== discountedPrice) {
    return `
      <div class="products__old-price">£${price}</div>
      <div class="products__discount">${performDiscount(price, discountedPrice)}%</div>
      <div class="products__current-price">£${discountedPrice}</div>
    `;
  }
  return `<div class="products__current-price">£${price}</div>`;
}

function performDiscount(price, discountedPrice) {
  return ((price - discountedPrice) / price) * 100;
}

function hasNew() {
    return `<div class="products__label">New</div>`;
}

function performProductsCount() {
  let clientWidth = checkClientWidth();
  let productsCountOnRow = 4;
  if(clientWidth >= 768 &&  clientWidth < 1024) {
    productsCountOnRow = 3;
  } else if(clientWidth < 768) {
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

function addShowMoreButton() {
  return `<a class="btn products__all-products" href="#">Show more</a>`;
}

function checkProductsCountChanges() {
  let productsCount = performProductsCount();
  if(productsCount !== productsCountGlobal) {
    productsCountGlobal = productsCount;
    return true;
  }
  return false;
}
