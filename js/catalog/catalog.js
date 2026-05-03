import { Product } from "./product.js";

class Catalog {
    #_items;

    constructor() {
        this.#_items = [];
        this.loadFromStorage();
    }

    get items() {
        return this.#_items;
    }

    getById(itemId) {
        return this.#_items.find(item => Number(item.id) === Number(itemId));
    }

    addItem(data) {

        const newProduct = new Product(
            data.id,
            data.title,
            data.price,
            data.description,
            data.image,
            data.type,
            data.material,
            data.color,
            data.quantity
        );
        this.#_items.push(newProduct);
        this.saveToStorage();
    }

    removeItem(itemId) {
        this.#_items = this.#_items.filter(item => Number(item.id) !== Number(itemId));
        this.saveToStorage();
    }

    saveToStorage() {
        localStorage.setItem("catalogDB", JSON.stringify(this.#_items));
    }

    loadFromStorage() {
        const catalogData = localStorage.getItem("catalogDB");

        if (catalogData && catalogData !== "[]" && catalogData !== "null") {
            try {
                const parsedData = JSON.parse(catalogData);
                this.#_items = parsedData.map(item => new Product(
                    item.id,
                    item.title,
                    item.price,
                    item.description,
                    item.image,
                    item.type,
                    item.material,
                    item.color,
                    item.quantity
                ));
            } catch (e) {
                console.error("Error parsing catalogDB:", e);
                this.initDefault();
            }
        } else {
            this.initDefault();
        }
    }

    initDefault() {
        const defaultData = [
            { id: 1, title: 'Chronograph Elite', price: 12500, description: 'An impeccable blend of precision engineering and timeless elegance.', type: 'Chronograph', material: 'Stainless Steel', color: 'Silver', quantity: 10 },
            { id: 2, title: 'Classic Master', price: 9800, description: 'A minimalist masterpiece for the modern professional.', type: 'Dress Watch', material: 'Gold', color: 'Gold', quantity: 5 },
            { id: 3, title: 'Diver Pro', price: 15400, description: 'Built to withstand the depths. Water resistant up to 300 meters.', type: 'Diver', material: 'Titanium', color: 'Black', quantity: 2 }
        ];

        this.#_items = [];
        defaultData.forEach(data => this.addItem(data)); // Використовуємо addItem для створення об'єктів Product
    }

    renderItem(itemId, actionName) {
        const product = this.getById(itemId);
        if (!product) return '';

        return `
            <div class="product-card">
                <div class="product-card-image-wrapper">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <h3 class="product-card-title">${product.title}</h3>
                <p class="product-card-price">${product.price.toLocaleString()} ₴</p>
                <button class="btn-secondary" onclick="${actionName}('product', ${product.id})">View Details</button>
            </div>
        `;
    }

    dropDatabase() {
        localStorage.removeItem("catalogDB");
        this.#_items = [];
        this.initDefault();
        this.saveToStorage();
    }

    updateProductQuantity(productId, newQuantity) {
        const product = this.getById(productId);
        if (product) {
            product.quantity = Math.max(0, parseInt(newQuantity));
            this.saveToStorage();
            return true;
        }
        return false;
    }

    getFilteredItems(params) {
        let result = [...this.#_items];

        if (params.search) {
            const query = params.search.toLowerCase();
            result = result.filter(p => p.title.toLowerCase().includes(query));
        }

        if (params.inStock) {
            result = result.filter(p => p.quantity > 0);
        }

        if (params.type) result = result.filter(p => p.type === params.type);
        if (params.material) result = result.filter(p => p.material === params.material);
        if (params.color) result = result.filter(p => p.color === params.color);

        if (params.minPrice) result = result.filter(p => p.price >= parseFloat(params.minPrice));
        if (params.maxPrice) result = result.filter(p => p.price <= parseFloat(params.maxPrice));

        if (params.sort) {
            switch(params.sort) {
                case 'price_asc': result.sort((a, b) => a.price - b.price); break;
                case 'price_desc': result.sort((a, b) => b.price - a.price); break;
                case 'title_asc': result.sort((a, b) => a.title.localeCompare(b.title)); break;
                case 'title_desc': result.sort((a, b) => b.title.localeCompare(a.title)); break;
            }
        }

        return result;
    }
}

export { Catalog };
window.catalog = new Catalog();