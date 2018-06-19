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
    let params = getProductParams();
    addToCart(productId, params);
  };
}


function addToCart(productId, params = {count: 'plus', color: null, size: null}) {
  let product = getProduct(productId);

  let products = getCartProducts();
  let totalSum = getCartProductSum();
  let totalCount = getCartProductCount();
  let productIdInCartIfFound = null;
  let productCountInCartIfFound = null;

  if(products.length !== 0 && totalSum && totalCount) {
    for(let i = 0; i < products.length; i++) {
      let prod = products[i];
      if(prod.id === productId && prod.color === params.color && prod.size === params.size) {
        productCountInCartIfFound = prod.count;
        prod.count = changeCount(prod.count, params.count, productCountInCartIfFound);
        productIdInCartIfFound = i;
        break;
      }
    }
  }

  if(productIdInCartIfFound == null) {
    let productForCart = formProductForCart(productId, 1, params.color, params.size);
    products.push(productForCart);
  }

  if(productIdInCartIfFound != null && products[productIdInCartIfFound].count === 0) {
    products = deleteProductFromCart(products, productId, params);
  }

  let price = performPrice(product.price, product.discountedPrice);

  totalSum = changeTotalSum(totalSum, price, params.count, productCountInCartIfFound);
  totalSum = roundNumber(totalSum);
  totalCount = changeCount(totalCount, params.count, productCountInCartIfFound);

  if(totalCount === 0) {
    products = [];
    totalSum = 0;
  }

  saveToLocalStorage(products, totalSum, totalCount);
}

function roundNumber(number) {
  return Math.round(number * 100) / 100;
}

function performPrice(price, discountedPrice) {
  if(price === discountedPrice) {
    return price;
  }
  return discountedPrice;
}

function formProductForCart(id, count, color, size) {
  return {
    id: id,
    count: count,
    color: color,
    size: size
  };
}

function saveToLocalStorage(products, sum, count) {
  localStorage.setItem('cartProductIds', JSON.stringify(products));
  localStorage.setItem('cartProductSum', JSON.stringify(sum));
  localStorage.setItem('cartProductCount', JSON.stringify(count));
  updateCartSumAndCountInHeader();
  updateCartSumInBagPage();
}

function deleteProductFromCart(productsCart, productId, params) {
  let newProductsArr = [];
  for(let i = 0; i < productsCart.length; i++) {
    let product = productsCart[i];
    if(product.id === productId && product.color === params.color && product.size === params.size) {
      continue;
    }
    newProductsArr.push(product);
  }
  return newProductsArr;
}

function changeCount(value, param, productCountInCart) {
  if(param === 'minus') {
    return --value;
  } else if(param === 'remove') {
    return value - productCountInCart;
  }
  return ++value;
}

function changeTotalSum(sum, value, param, productCountInCart) {
  if(param === 'minus') {
    return sum - value;
  } else if(param === 'remove') {
    return sum - (value * productCountInCart);
  }
  return sum + value;
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
        ${(product.hasNew) ? hasNew() : ''}
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
        ${addPriceForItem(product.price, product.discountedPrice, product.placeholder)}
      </div>
    </div>
    <div class="product__filters">
      ${addFilters(product.sizes, 'Size')}
      ${addFilters(product.colors, 'Color')}
    </div>
    ${(product.price !== null) ? '<div class="btn product__add-to-bag">Add to bag</div>' : ''}
  `;
  return productInfoHtml;
}

function productAdditionalPhoto(title, photos) {
  let photosHtml = '';
  for(let i = 0; i < photos.length; i++) {
    let photo = photos[i];
    photosHtml += `<div class="product__additional-photo${(i === 0) ? ' active' : ''}"><img src="${photo}" alt="Additional photo for ${title}"></div>`;
  }
  return photosHtml;
}

function addPriceForItem(price, discountedPrice, placeholder) {
  if(price !== discountedPrice) {
    return `
      <div class="product__old-price">£${price}</div>
      <div class="product__discount">${performDiscount(price, discountedPrice)}%</div>
      <div class="product__price">£${discountedPrice}</div>
    `;
  }
  return `<div class="product__price">${(price !== null) ? '£' + price : 'Not available'}</div>`;
}

function addFilters(parameters, title) {
  if(parameters.length === 0) {
    return '';
  }
  let parametersHtml = `<div class="product__filter">
        <div class="product__filter-name">${title}:</div>
        <ul class="product__filter-list" id="${title.toLowerCase()}">
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

function getProductParams() {
  let color = document.querySelector('#color .active');
  let size = document.querySelector('#size .active');
  return setProductParams(color, size);
}

let productAlbumHtml = document.querySelector('.product__album');

if(productAlbumHtml) {
  productAlbumHtml.addEventListener('click', function (event) {
    let target = event.target;
    if(target.tagName === 'IMG') {
      changeProductMainImage(target);
    }
  });
}

function changeProductMainImage(target) {
  let img = target;
  let imgUrl = img.src;

  while(target.className !== 'product__album') {
    target = target.parentNode;
  }

  let additionalPhotos = target.querySelectorAll('.product__additional-photo');

  for(let i = 0; i < additionalPhotos.length; i++) {
    let additionalPhoto = additionalPhotos[i];
    if(additionalPhoto.classList.contains('active')) {
      additionalPhoto.classList.remove('active');
    }
  }

  img.parentNode.classList.add('active');
  let mainPhoto = target.querySelector('.product__main-photo');
  mainPhoto.src = imgUrl;
}
