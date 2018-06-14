let filters = document.getElementsByClassName('filters__list')[0];

if(filters) {
  filters.onclick = function (event) {
    let target = event.target;
    if(target.tagName !== 'LI') {
      return 0;
    }
    changeFilterItem(target);
  };
}

function changeFilterItem(target) {
  let filterItem = target;
  let filter = filterItem.parentNode;
  let filterName = filter.parentNode.getElementsByClassName('filter__name')[0];

  if(filterItem.classList.contains('active')) {
    removeActiveFilter(filterItem);
    toggleActiveItem(filterName);
    return 0;
  }

  if(filterName.classList.contains('active')) {
    changeActiveFilter(filterItem);
  } else {
    addActiveFilter(filterName, filterItem);
  }
  filterItem.classList.add('active');
}

function changeActiveFilter(filterItem) {
  let filter = filterItem.parentNode;
  let filterItemContent = filterItem.innerHTML;
  let selectedFilter =  filter.parentNode.getElementsByClassName('filter__selected')[0];
  selectedFilter.innerHTML = filterItemContent;
  let filterItems = filter.getElementsByTagName('li');
  for(let i = 0; i < filterItems.length; i++) {
    if (filterItems[i].classList.contains('active')) {
      filterItems[i].classList.remove('active');
    }
  }
}

function addActiveFilter(filterName, filterItem) {
  let filterItemContent = filterItem.innerHTML;
  toggleActiveItem(filterName);
  let filterSelected = document.createElement('div');
  filterSelected.className = 'filter__selected';
  filterSelected.innerHTML = filterItemContent;
  filterName.insertAdjacentElement('afterend', filterSelected);
}

function removeActiveFilter(filterItem) {
  let filter = filterItem.parentNode;
  filterItem.classList.remove('active');
  let filterSelected = filter.parentNode.getElementsByClassName('filter__selected')[0];
  filter.parentNode.removeChild(filterSelected);
}

function toggleActiveItem(item) {
  if(item.classList.contains('active')) {
    item.classList.remove('active');
  } else {
    item.classList.add('active');
  }
}
