import { Validator } from "../user/validator.js";

window.navigateAccount = function(tab, queryString = '') {
    const url = `?tab=${tab}${queryString ? '&' + queryString : ''}`;
    history.pushState({tab: tab}, '', url);
    initAccountRouter();
}

function initAccountRouter() {
    const isLoggedIn = window.auth ? window.auth.isLoggedIn() : false;
    if (!isLoggedIn) {
        window.location.href = "catalog.html";
        return;
    }

    const user = window.auth.currentUser;
    const container = document.getElementById('account-content');

    if (user.role !== 'admin') {
        if(window.renderUserProfile) window.renderUserProfile(container, user);
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab') || 'users';

    window.renderAdminDashboard(container, tab);

    if (tab === 'users') {
        window.renderAdminUsers();
    } else if (tab === 'products') {
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

        if (!document.getElementById('admin-products-table-container')) {
            window.renderAdminProductsLayout();
        }

        window.renderFilters(currentParams, 'handleAdminApplyFilters', 'handleAdminResetFilters');

        const filteredItems = window.catalog.getFilteredItems(currentParams);
        window.renderAdminProductsTable(filteredItems);
    }
}

window.handleProfileUpdate = function(event) {
    event.preventDefault();
    document.querySelectorAll('.field-error').forEach(el => el.style.display = 'none');
    document.getElementById('prof-success-msg').style.display = 'none';

    const formData = {
        firstName: document.getElementById('prof-firstname').value.trim(),
        lastName: document.getElementById('prof-lastname').value.trim(),
        phone: document.getElementById('prof-phone').value.trim()
    };

    const validation = Validator.validateProfileUpdate(formData);

    if (!validation.isValid) {
        for (const [fieldId, errorMessage] of Object.entries(validation.errors)) {
            const errorEl = document.getElementById('err-' + fieldId);
            if (errorEl) {
                errorEl.textContent = errorMessage;
                errorEl.style.display = 'block';
            }
        }
        return;
    }

    const result = window.auth.updateUserData(formData);
    if (result.success) {
        document.getElementById('prof-success-msg').style.display = 'block';
    } else {
        alert("Error: " + result.error);
    }
}

window.handleAdminApplyFilters = function(event) {
    event.preventDefault();
    const params = window.getFilterParamsFromForm();
    const urlParams = new URLSearchParams();

    if (params.search) urlParams.set('search', params.search);
    if (params.inStock) urlParams.set('inStock', 'true');
    if (params.type) urlParams.set('type', params.type);
    if (params.material) urlParams.set('material', params.material);
    if (params.color) urlParams.set('color', params.color);
    if (params.minPrice) urlParams.set('minPrice', params.minPrice);
    if (params.maxPrice) urlParams.set('maxPrice', params.maxPrice);
    if (params.sort) urlParams.set('sort', params.sort);

    window.navigateAccount('products', urlParams.toString());
}

window.handleAdminResetFilters = function() {
    window.navigateAccount('products', '');
}

window.handleDeleteProduct = function(productId) {
    if (confirm("Are you sure you want to delete this product?")) {
        window.catalog.removeItem(productId);
        initAccountRouter();
    }
}

window.handleStepQuantity = function(productId, step) {
    const product = window.catalog.getById(productId);
    if (product) {
        const newQty = (product.quantity || 0) + step;
        window.catalog.updateProductQuantity(productId, newQty);
        initAccountRouter();
    }
};

window.handleInputQuantity = function(productId, value) {
    window.catalog.updateProductQuantity(productId, value);
    initAccountRouter();
};

window.handleAddProduct = function(event) {
    event.preventDefault();

    const title = document.getElementById('new-prod-title').value.trim();
    const price = parseFloat(document.getElementById('new-prod-price').value);
    const quantity = parseInt(document.getElementById('new-prod-qty').value);
    const type = document.getElementById('new-prod-type').value;
    const material = document.getElementById('new-prod-material').value;
    const color = document.getElementById('new-prod-color').value;
    const description = document.getElementById('new-prod-description').value.trim();
    const imageUrlInput = document.getElementById('new-prod-image-url').value.trim();
    const imageUrl = imageUrlInput !== "" ? imageUrlInput : null;

    window.catalog.addItem({
        id: Date.now(), title, price, quantity, type, material, color, description, image: imageUrl
    });

    const form = document.querySelector('.account-form');
    if(form) form.reset();


    const urlParams = new URLSearchParams(window.location.search);
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

    const filteredItems = window.catalog.getFilteredItems(currentParams);

    window.renderAdminProductsTable(filteredItems);
    alert("Product added successfully!");
}

window.handleDeleteUser = function(userId) {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
        const result = window.auth.deleteUser(userId);

        if (result.success) {
            initAccountRouter();
        } else {
            alert(result.error);
        }
    }
}

window.addEventListener('popstate', () => {
    initAccountRouter();
});

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(initAccountRouter, 50);
});