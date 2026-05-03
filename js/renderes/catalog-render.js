window.renderNotLoggedIn = function() {
    const appContainer = document.getElementById('app');
    if (!appContainer) return;

    const filtersContainer = document.getElementById('filter-container');
    if (filtersContainer) filtersContainer.style.display = 'none';

    appContainer.innerHTML = `
        <div class="not-logged-in-message">
            <h2>Please Log In</h2>
            <p>You need to log in to view our collection. Click the button below to go to the login page.</p>
            <div class="choice-buttons">
                 <a href="auth?action=login" class="btn-primary" id="Login">Go to Login</a>
                 <a href="auth?action=register" class="btn-primary" id="Register">Go to Register</a>
            </div>    
        </div>
    `;
}

window.renderCatalog = function(items) {
    const catalogHeader = document.getElementById('catalog-header');
    if (catalogHeader) {
        catalogHeader.innerHTML = `<h1>Our Collection</h1>`;
        catalogHeader.style.display = 'block';
    }
    const filtersContainer = document.getElementById('filters-container');
    if (filtersContainer) {
        filtersContainer.style.display = 'block';
    }
    const appContainer = document.getElementById('catalog-container');
    if (!appContainer || !window.catalog) return;

    if (items.length > 0) {
        appContainer.innerHTML = items.map(product => window.catalog.renderItem(product.id, 'window.navigate')).join('');
        appContainer.className = 'products-grid';
    } else {
        appContainer.className = '';
        appContainer.innerHTML = '<div class="no-results"><p>No products found matching your criteria.</p></div>';
    }
}

window.renderProduct = function (id) {
    const catalogHeader = document.getElementById('catalog-header');
    if (catalogHeader) catalogHeader.style.display = 'none';
    const filtersContainer = document.getElementById('filters-container');
    if (filtersContainer) {
        filtersContainer.style.height = 'auto';
        filtersContainer.style.display = 'none';
    }

    const appContainer = document.getElementById('app');
    if (!appContainer || !window.catalog) return;

    const product = window.catalog.getById(id);

    if (!product) {
        appContainer.innerHTML = `
            <div class="product-not-found">
                <h2>Product not found</h2>
                <a onclick="window.navigate('catalog')">Back to collection</a>
            </div>`;
        return;
    }

    appContainer.innerHTML = `
        <div class="product-glass-container">
            <!-- Хлібні крихти винесені на самий верх -->
            <nav class="product-breadcrumbs">
                <a onclick="window.navigate('catalog')" class="breadcrumb-link">Catalog</a>
                <span class="breadcrumb-separator">/</span>
                <span class="breadcrumb-current">${product.title}</span>
            </nav>

            <section class="product-detail-section">
                <div class="product-detail-image-container">
                    <img src="${product.image}" alt="${product.title}" class="product-detail-image">
                </div>
                
                <div class="product-detail-info">
                    <div class="product-detail-eyebrow">Swiss Made (ID: ${product.id})</div>
                    <h2 class="product-detail-title">${product.title}</h2>
                    <div class="product-detail-price">${product.price.toLocaleString()} ₴</div>
                    
                    <!-- Новий блок з характеристиками -->
                    <div class="product-attributes">
                        <div class="attr-item"><span class="attr-label">Type:</span> ${product.type}</div>
                        <div class="attr-item"><span class="attr-label">Material:</span> ${product.material}</div>
                        <div class="attr-item"><span class="attr-label">Dial Color:</span> ${product.color}</div>
                    </div>

                    <p class="product-detail-description">
                        ${product.description}
                    </p>
                    
                    <!-- Кнопка розтягнута на всю ширину для кращого вигляду -->
                    <button class="btn-primary btn-large" style="width: 100%; padding: 18px;" onclick="window.handleAddToCart(${product.id})">Add to Cart</button>
                </div>
            </section>
        </div>
    `;
}