let menu = document.getElementsByClassName('menu__burger')[0];

menu.onclick = function () {
  let body = document.body;
  if(body.classList.contains('overflow__hidden')) {
    body.classList.remove('overflow__hidden');
  } else {
    body.classList.add('overflow__hidden');
  }
};
