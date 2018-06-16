let productsBagHtml = document.querySelector('.bag__products');

if(productsBagHtml) {
  addProductsOnBagPage();

  productsBagHtml.addEventListener('click', function (event) {
    let target = event.target;

    if(target.classList.contains('bag__quantity-minus') || target.classList.contains('bag__quantity-plus')) {
      changeProductQuantity(target);
    }
  })
}

function addProductsOnBagPage() {
  let products = catalog;
  let productsCart = getCartProducts();
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

function formBagProductItem(product, productCartParams) {
  return `
    <div class="bag-item" id="${product.id}">
      <div class="bag-item__img">
        <img src="${product.thumbnail}" alt="${product.title}">
        <div class="bag-item__hover"><a href="item.html?id=${product.id}" class="products__hover-link">View item</a></div>
      </div>
      <div class="bag-item__information">
        <a  href="item.html?id=${product.id}" class="bag-item-title">${product.title}</a>
        <div class="bag-item__current-price">£${(product.price === product.discountedPrice) ? product.price : product.discountedPrice}</div>
        <div class="bag-item__params">
          <div class="bag-item__param">Color:<span class="bag-item__color">Phillipa wash</span></div>
          <div class="bag-item__param">Size:<span class="bag-item__size">UK 17</span></div>
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
  let params = {count: 'plus', color: null, size: null};
  if(target.classList.contains('bag__quantity-minus')) {
    params = {count: 'minus', color: null, size: null};
  }
  while(target.className !== 'bag-item') {
    target = target.parentNode;
  }
  let productId = target.id;

  addToCart(productId, params);
}
