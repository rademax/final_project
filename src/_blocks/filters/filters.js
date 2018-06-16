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
  let filterItems = filter.getElementsByTagName('li');

  if(filterItem.innerHTML === 'Not selected' && filterItem.classList.contains('active')) {
    return 0;
  }

  deactivateFilterItems(filterItems);
  activateFilterItem(filterItem);

  if(filterItem.innerHTML === 'Not selected') {
    deleteBlockAboutActiveFilter(filterItem);
    toggleActiveItem(filterName);
    return 0;
  }

  if(filterName.classList.contains('active')) {
    changeBlockAboutActiveFilter(filterItem);
  } else {
    addBlockAboutActiveFilter(filterItem, filterName);
    toggleActiveItem(filterName);
  }
}

function activateFilterItem(filterItem) {
  filterItem.classList.add('active');
}

function addBlockAboutActiveFilter(filterItem, filterName) {
  let filterSelected = document.createElement('div');
  filterSelected.className = 'filter__selected';
  filterSelected.innerHTML = filterItem.innerHTML;
  filterName.insertAdjacentElement('afterend', filterSelected);
}

function deactivateFilterItems(filterItems) {
  for(let i = 0; i < filterItems.length; i++) {
    if (filterItems[i].classList.contains('active')) {
      filterItems[i].classList.remove('active');
    }
  }
}

function changeBlockAboutActiveFilter(filterItem) {
  let selectedFilter = defineSelectedFilter(filterItem);
  selectedFilter.innerHTML = filterItem.innerHTML;
}

function defineSelectedFilter(filterItem) {
  let filter = filterItem.parentNode;
  return filter.parentNode.getElementsByClassName('filter__selected')[0];
}

function deleteBlockAboutActiveFilter(filterItem) {
  let filter = filterItem.parentNode;
  let selectedFilter = defineSelectedFilter(filterItem);
  if(filter.parentNode.contains(selectedFilter)) {
    filter.parentNode.removeChild(selectedFilter);
  }
}

function toggleActiveItem(item) {
  if(item.classList.contains('active')) {
    item.classList.remove('active');
  } else {
    item.classList.add('active');
  }
}
