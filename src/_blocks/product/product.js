let productHtml = document.querySelector('.product');
let productFilters;
let addToBagButton;

if(productHtml) {
  addProductOnPage();
  productFilters = document.querySelector('.product__filters');
  addToBagButton = document.querySelector('.product__add-to-bag');
}

if(productFilters) {
  productFilters.onclick = function (event) {
    let target = event.target;
    if(target.tagName !== 'LI') {
      return 0;
    }
    changeProductFilter(target);
  };
}

if(addToBagButton) {
  addToBagButton.onclick = function () {
    let productId = getProductId();
    addToCart(productId);
  };
}

function addToCart(productId, params = {count: 'plus', color: null, size: null}) {
  let product = getProduct(productId);

  let products = getCartProducts();
  let sum = getCartProductSum();
  let count = getCartProductCount();
  let productIdInCartIfFound = null;

  let productForCart = {
    id: productId,
    count: 1,
    color: params.color,
    size: params.size
  };

  if(products.length !== 0 && sum && count) {
    for(let i = 0; i < products.length; i++) {
      let prod = products[i];
      if(prod.id === productId && prod.color === params.color && prod.size === params.size) {
        prod.count = changeCount(prod.count, params.count);
        productIdInCartIfFound = i;
        break;
      }
    }
  }

  if(productIdInCartIfFound == null) {
    products.push(productForCart);
  }

  if(productIdInCartIfFound != null && products[productIdInCartIfFound].count === 0) {
    console.log('It is good');
    products = deleteProductFromCart(products, productId);
  }

  let price = (product.price === product.discountedPrice) ? product.price : product.discountedPrice;
  sum = changePrice(sum, price, params.count);
  count = changeCount(count, params.count);

  console.log(products);
  console.log(sum);
  console.log(count);

  localStorage.setItem('cartProductIds', JSON.stringify(products));
  localStorage.setItem('cartProductSum', JSON.stringify(sum));
  localStorage.setItem('cartProductCount', JSON.stringify(count));

  updateCartSumAndCountInHeader();
}

function deleteProductFromCart(productsCart, productId) {
  let newProductsArr = [];
  for(let i = 0; i < productsCart.length; i++) {
    let product = productsCart[i];
    if(product.id === productId) {
      continue;
    }
    newProductsArr.push(product);
  }
  console.log(newProductsArr);
  return newProductsArr;
}

function changeCount(value, param) {
  if(param === 'plus') {
    return ++value;
  }
  return --value;
}

function changePrice(sum, value, param) {
  if(param === 'plus') {
    return sum+value;
  }
  return sum-value;
}

function getCartProducts() {
  let lsCartProducts = localStorage.getItem('cartProductIds');
  if(lsCartProducts) {
    return JSON.parse(lsCartProducts);
  }
  return [];
}

function getCartProductSum() {
  let lsCartProductSum = localStorage.getItem('cartProductSum');
  if(lsCartProductSum) {
    return JSON.parse(lsCartProductSum);
  }
  return 0;
}

function getCartProductCount() {
  let lsCartProductCount = localStorage.getItem('cartProductCount');
  if(lsCartProductCount) {
    return JSON.parse(lsCartProductCount);
  }
  return 0;
}

function getProductId() {
  let regexp = /id=([^&]+)/i;
  let value = '';
  if (!!regexp.exec(document.location.search)) {
    value = regexp.exec(document.location.search)[1];
  }
  console.log(value);
  return value;
}

function getProduct(id = null) {
  if(!id) {
    id = getProductId();
  }
  for(let i = 0; i < catalog.length; i++) {
    let product = catalog[i];
    if(id === product.id) {
      return product;
    }
  }
}

function addProductOnPage() {
  let product = getProduct();
  let productAlbum = formProductAlbum(product);
  let productContent = formProductContent(product);
  productHtml.appendChild(productAlbum);
  productHtml.appendChild(productContent);
}

function formProductAlbum(product) {
  let productAlbumHtml = document.createElement("div");
  productAlbumHtml.classList.add('product__album');
  productAlbumHtml.innerHTML = `
      <div class="product__album-main">
        <img src="${product.thumbnail}" alt="${product.title}" class="product__main-photo">
      </div>
      <div class="product__album-additional">
        ${productAdditionalPhoto(product.title, product.preview)}
      </div>
  `;
  return productAlbumHtml;
}

function formProductContent(product) {
  let productInfoHtml = document.createElement("div");
  productInfoHtml.classList.add('product__information');
  productInfoHtml.innerHTML = `
    <div class="product__title">${product.title}</div>
    <div class="product__information-main">
      <div class="product__description">${product.description}</div>
      <div class="product__prices">
        ${addPriceForItem(product.price, product.discountedPrice)}
      </div>
    </div>
    <div class="product__filters">
      ${addFilters(product.sizes, 'Size')}
      ${addFilters(product.colors, 'Color')}
    </div>
    <div class="btn product__add-to-bag">Add to bag</div>
  `;
  return productInfoHtml;
}

function productAdditionalPhoto(title, photos) {
  let photosHtml = '';
  for(let i = 0; i < photos.length; i++) {
    let photo = photos[i];
    photosHtml += `<div class="product__additional-photo"><img src="${photo}" alt="Additional photo for ${title}"></div>`;
  }
  return photosHtml;
}

function addPriceForItem(price, discountedPrice) {
  if(price !== discountedPrice) {
    return `
      <div class="product__old-price">£${price}</div>
      <div class="product__discount">${performDiscount(price, discountedPrice)}%</div>
      <div class="product__price">£${discountedPrice}</div>
    `;
  }
  return `<div class="product__price">£${price}</div>`;
}

function addFilters(parameters, title) {
  if(parameters.length === 0) {
    return '';
  }
  let parametersHtml = `<div class="product__filter">
        <div class="product__filter-name">${title}:</div>
        <ul class="product__filter-list">
   `;
  for(let i = 0; i < parameters.length; i++) {
    let parameter = parameters[i];
    parametersHtml += `<li`;
    (i === 0) ? parametersHtml += ` class="active"` : '';
    parametersHtml += `>${parameter}</li>`;
  }
  parametersHtml += `
      </ul>
    </div>
  `;
  return parametersHtml;
}

function changeProductFilter(filterItem) {
  let filterItems = filterItem.parentNode.getElementsByTagName('li');
  deactivateFilterItems(filterItems);
  activateFilterItem(filterItem);
}
