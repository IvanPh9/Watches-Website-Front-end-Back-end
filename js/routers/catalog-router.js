import { initConstants } from "../utils/constants.js";

window.navigate = function(view, id = null, queryString = '') {
    if (view === 'product') {
        window.location.href = '?id=' + id;
    } else {
        window.location.href = queryString ? '?' + queryString : window.location.pathname;
    }
}

function initRouter() {

    const urlParams = new URLSearchParams(window.location.search);
    const isLoggedIn = window.auth ? window.auth.isLoggedIn() : false;

    console.log(window.auth);

    if (!isLoggedIn) {
        window.renderNotLoggedIn();
    } else {
        if (urlParams.has('id')) {
            window.renderProduct(urlParams.get('id'));
        } else {
            const currentParams = {
                search: urlParams.get('search') || '',
                inStock: urlParams.get('inStock') === 'true',
                type: urlParams.get('type') || '',
                material: urlParams.get('material') || '',
                color: urlParams.get('color') || '',
                minPrice: urlParams.get('minPrice') || '',
                maxPrice: urlParams.get('maxPrice') || '',
                sort: urlParams.get('sort') || ''
            };

            window.renderFilters(currentParams, 'handleApplyFilters', 'handleResetFilters');
            if (currentParams) {
                const filteredItems = window.catalog.getFilteredItems(currentParams);
                window.renderCatalog(filteredItems);
            }
            else {
                window.renderCatalog(window.catalog.items);
            }
        }
    }
}

window.handleApplyFilters = function(event) {
    event.preventDefault();
    const urlParams = new URLSearchParams();

    const search = document.getElementById('filter-search').value.trim();
    if (search) urlParams.set('search', search);

    if (document.getElementById('filter-instock').checked) urlParams.set('inStock', 'true');

    const type = document.getElementById('filter-type').value;
    if (type) urlParams.set('type', type);

    const material = document.getElementById('filter-material').value;
    if (material) urlParams.set('material', material);

    const color = document.getElementById('filter-color').value;
    if (color) urlParams.set('color', color);

    const minPrice = document.getElementById('filter-min-price').value;
    if (minPrice) urlParams.set('minPrice', minPrice);

    const maxPrice = document.getElementById('filter-max-price').value;
    if (maxPrice) urlParams.set('maxPrice', maxPrice);

    const sort = document.getElementById('filter-sort').value;
    if (sort) urlParams.set('sort', sort);

    window.navigate('catalog', null, urlParams.toString());
}

window.handleResetFilters = function() {
    window.navigate('catalog', null, '');
}

window.handleAddToCart = function(productId) {
    const result = window.cart.addItem(productId, 1);
    if (result.success) {
        alert("Product added to your cart!");
    } else {
        alert(result.error);
    }
};

window.addEventListener('popstate', async () => {
    await initConstants();
    await window.catalog.loadFromStorage();
    initRouter();
});

window.addEventListener('DOMContentLoaded', async () => {
    await initConstants();
    await window.catalog.loadFromStorage();
    initRouter();
});