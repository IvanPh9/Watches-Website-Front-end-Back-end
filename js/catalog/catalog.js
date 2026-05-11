import { Product } from "./product.js";

class Catalog {
    #_items;

    constructor() {
        this.#_items = [];
    }

    get items() {
        return this.#_items;
    }

    getById(itemId) {
        return this.#_items.find(item => Number(item.id) === Number(itemId));
    }

    async addItem(data) {
        try {
            const response = await fetch('http://localhost:3000/api/watches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error("Не вдалося додати товар в БД");

            const newDbProduct = await response.json();

            // Створюємо локальний об'єкт з РЕАЛЬНИМ ID, який повернула база
            const newProduct = new Product(
                newDbProduct.id,
                data.title,
                data.price,
                data.description,
                data.image || newDbProduct.image_url,
                data.type,
                data.material,
                data.color,
                data.quantity
            );

            this.#_items.push(newProduct);
            // this.saveToStorage(); - більше не викликаємо
        } catch (error) {
            console.error("Помилка додавання товару:", error);
            alert("Помилка при збереженні товару в базу даних.");
        }
    }

    async removeItem(itemId) {
        try {
            const response = await fetch(`http://localhost:3000/api/watches/${itemId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error("Не вдалося видалити товар з БД");

            // Оновлюємо локальний масив тільки якщо БД успішно видалила
            this.#_items = this.#_items.filter(item => Number(item.id) !== Number(itemId));
        } catch (error) {
            console.error("Помилка видалення товару:", error);
            alert("Помилка при видаленні товару.");
        }
    }

    async loadFromStorage()  {
        try {
            const response = await fetch('http://localhost:3000/api/watches');
            if (!response.ok) {
                throw new Error(`Помилка сервера: ${response.status}`);
            }

            const dbData = await response.json();

            this.#_items = dbData.map(item => new Product(
                item.id,
                item.title,         // У базі тепер title (з таблиці watches)
                item.price,
                item.description,
                item.image_url,     // Збігається з image_url у базі
                item.type,          // Ми використали AS type у SQL-запиті
                item.material,      // Ми використали AS material у SQL-запиті
                item.color,         // Ми використали AS color у SQL-запиті
                item.stock_quantity
            ));

            console.log("Дані успішно завантажені з бази:", this.#_items);

        } catch (e) {
            console.error("Помилка завантаження даних з API:", e);
            this.initDefault();
        }
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

    async updateProductQuantity(productId, newQuantity) {
        const product = this.getById(productId);
        if (!product) return false;

        const qty = Math.max(0, parseInt(newQuantity));

        try {
            const response = await fetch(`http://localhost:3000/api/watches/${productId}/quantity`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity: qty })
            });

            if (!response.ok) throw new Error("Не вдалося оновити кількість в БД");

            // Оновлюємо локально
            product.quantity = qty;
            return true;
        } catch (error) {
            console.error("Помилка оновлення кількості:", error);
            return false;
        }
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