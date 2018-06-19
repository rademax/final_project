let productsBagHtml = document.querySelector('.bag__products');
let bagHtml = document.querySelector('.bag');
let totalSum = document.querySelector('.bag_total-sum');

if(productsBagHtml) {
  addProductsOnBagPage();

  productsBagHtml.addEventListener('click', function (event) {
    let target = event.target;

    if(target.classList.contains('bag__quantity-minus')
      || target.classList.contains('bag__quantity-plus')
      || target.classList.contains('bag-item__remove')) {
      changeProductQuantity(target);
    }
  });

  bagHtml.addEventListener('click', function (event) {
    let target = event.target;

    if(target.classList.contains('bag_clear')) {
      clearProductsCart();
      addNoProductsInCartMessage();
      return 0;
    }

    if(target.classList.contains('bag_buy')) {
      clearProductsCart();
      addThankYouMessage();
      return 0;
    }
  });
}

if(totalSum) {
  updateCartSumInBagPage();
}

function clearProductsCart() {
  saveToLocalStorage([], 0, 0);
  clearProductsFromBagPage();
}

function addProductsOnBagPage() {
  let products = catalog;
  let productsCart = getCartProducts();
  if(productsCart.length === 0) {
    addNoProductsInCartMessage();
    return 0;
  }
  let productsList = document.createElement("div");
  productsList.classList.add("products__list");
  for(let i = 0; i < products.length; i++) {
    let product = products[i];
    for(let j = 0; j < productsCart.length; j++) {
      let productCartParams = productsCart[j];
      if(product.id === productCartParams.id) {
        productsList.innerHTML += formBagProductItem(product, productCartParams);
      }
    }
  }
  productsBagHtml.appendChild(productsList);
}

function addNoProductsInCartMessage() {
  productsBagHtml.innerHTML = `<div class="bag__message">Your shopping bag is empty. Use <a href="catalog.html">catalog</a> to add new items</div>`;
}

function addThankYouMessage() {
  productsBagHtml.innerHTML = `<div class="bag__message">Thank you for your purchase</div>`;
}

function clearProductsFromBagPage() {
  productsBagHtml.innerHTML = '';
}

function formBagProductItem(product, productCartParams) {
  return `
    <div class="bag-item" id="${product.id}">
      <div class="bag-item__img">
        ${(product.hasNew) ? hasNew() : ''}
        <img src="${product.thumbnail}" alt="${product.title}">
        <div class="bag-item__hover"><a href="item.html?id=${product.id}" class="products__hover-link">View item</a></div>
      </div>
      <div class="bag-item__information">
        <a  href="item.html?id=${product.id}" class="bag-item-title">${product.title}</a>
        <div class="bag-item__current-price">£${(product.price === product.discountedPrice) ? product.price : product.discountedPrice}</div>
        <div class="bag-item__params">
          ${(productCartParams.color) ? '<div class="bag-item__param">Color:<span class="bag-item__color">' + productCartParams.color + '</span></div>' : ''}
          ${(productCartParams.size) ? '<div class="bag-item__param">Size:<span class="bag-item__size">' + productCartParams.size + '</span></div>' : ''}
          <div class="bag-item__param">
            Quantity:
            <img class="bag__quantity-minus" src="img/icon_minus.png" alt="Minus">
            <span class="bag-item__quantity">${productCartParams.count}</span>
            <img class="bag__quantity-plus" src="img/icon_plus.png" alt="Plus">
          </div>
        </div>
        <a class="bag-item__remove" href="#">Remove item</a>
      </div>
     </div>
  `;
}

function changeProductQuantity(target) {
  let params;
  let count = 'plus';
  let productId;
  if(target.classList.contains('bag__quantity-minus')) {
    count = 'minus';
  }
  if(target.classList.contains('bag-item__remove')) {
    let deleteProduct = formConfirmMessageToDeleteProduct();
    if(!deleteProduct) {
      return 0;
    }
    count = 'remove';
  }
  target = foundProductOnCartPage(target);

  params = getProductInBagParams(target);
  params.count = count;

  productId = target.id;
  addToCart(productId, params);

  clearProductsFromBagPage();
  addProductsOnBagPage();
}

function foundProductOnCartPage(target) {
  while(target.className !== 'bag-item') {
    target = target.parentNode;
  }
  return target;
}

function updateCartSumInBagPage() {
  if(totalSum) {
    totalSum.innerHTML = "£" + getCartProductSum();
  }
}

function getProductInBagParams(target) {
  let color = target.querySelector('.bag-item__color');
  let size = target.querySelector('.bag-item__size');
  return setProductParams(color, size);
}

function setProductParams(color, size) {
  let params = {count: 'plus', color: null, size: null, remove: false};
  (color) ? params.color = color.innerHTML : '';
  (size) ? params.size = size.innerHTML : '';
  return params;
}

function formConfirmMessageToDeleteProduct() {
  return confirm('Are you sure that you want to remove item(s)?');
}
