class Cart {
    #_items;

    constructor() {
        this.#_items = [];
        this.loadFromStorage();
    }

    get items() {
        return this.#_items;
    }

    loadFromStorage() {
        const cartData = localStorage.getItem("cartDB");
        if (cartData) {
            try {
                this.#_items = JSON.parse(cartData);
            } catch (e) {
                console.error("Error parsing cartDB:", e);
                this.#_items = [];
            }
        }
    }

    saveToStorage() {
        localStorage.setItem("cartDB", JSON.stringify(this.#_items));
    }

    addItem(productId, requestedQuantity = 1) {
        if (!window.catalog) return { success: false, error: "Catalog is not loaded." };

        const product = window.catalog.getById(productId);
        if (!product) return { success: false, error: "Product not found." };

        const existingItem = this.#_items.find(item => Number(item.productId) === Number(productId));
        const currentCartQty = existingItem ? existingItem.quantity : 0;
        const newTotalQty = currentCartQty + requestedQuantity;

        if (newTotalQty > product.quantity) {
            return {
                success: false,
                error: `Sorry, only ${product.quantity} items available in stock.`
            };
        }

        if (existingItem) {
            existingItem.quantity = newTotalQty;
        } else {
            this.#_items.push({ productId: Number(productId), quantity: newTotalQty });
        }

        this.saveToStorage();
        return { success: true };
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity <= 0) {
            this.removeItem(productId);
            return { success: true };
        }

        if (!window.catalog) return { success: false, error: "Catalog is not loaded." };

        const product = window.catalog.getById(productId);
        if (!product) return { success: false, error: "Product not found." };

        if (newQuantity > product.quantity) {
            return {
                success: false,
                error: `Maximum available stock is ${product.quantity}.`
            };
        }

        const item = this.#_items.find(i => Number(i.productId) === Number(productId));
        if (item) {
            item.quantity = newQuantity;
            this.saveToStorage();
            return { success: true };
        }

        return { success: false, error: "Item not in cart." };
    }

    removeItem(productId) {
        this.#_items = this.#_items.filter(item => Number(item.productId) !== Number(productId));
        this.saveToStorage();
    }

    clearCart() {
        this.#_items = [];
        this.saveToStorage();
    }

    renderCartItem(cartItem, productInfo) {
        if (!productInfo) return '';

        const itemTotal = productInfo.price * cartItem.quantity;

        const isAvailableOnStock = productInfo.quantity > 0;

        const canAddMore = cartItem.quantity < productInfo.quantity;

        const disableMinus = !isAvailableOnStock ? 'disabled' : '';
        const disablePlus = (!isAvailableOnStock || !canAddMore) ? 'disabled' : '';

        const cardClass = isAvailableOnStock ? 'cart-item' : 'cart-item-disable';
        const stockMessage = isAvailableOnStock ? `In stock: ${productInfo.quantity}` : 'Out of stock!';

        return `
            <div class="${cardClass}">
                <div class="cart-item-info">
                 <img src="${productInfo.image || `https://placehold.co/100x100?text=Watch+${productInfo.id}`}" alt="${productInfo.title}" class="cart-item-image">
                    
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${productInfo.title}</h4>
                        <p class="cart-item-price">Price: ${productInfo.price.toLocaleString()} ₴</p>
                    </div>
                    
                    <div>
                        <p class="cart-item-stock" style="${isAvailableOnStock ? '' : 'color: red; font-weight: bold;'}">${stockMessage}</p>
                        <div class="cart-item-quantity-controls">
                            <button class="btn-quantity" 
                                    ${disableMinus} 
                                    ${!disableMinus ? `onclick="window.handleUpdateCart(${productInfo.id}, ${cartItem.quantity - 1})"` : ''}>
                                -
                            </button>
                            
                            <span class="cart-item-quantity">${cartItem.quantity}</span>
                            
                            <button class="btn-quantity" 
                                    ${disablePlus} 
                                    ${!disablePlus ? `onclick="window.handleUpdateCart(${productInfo.id}, ${cartItem.quantity + 1})"` : ''}>
                                +
                            </button>
                        </div>
                    </div>
                    
                    
                    <div class="cart-item-total">
                        ${itemTotal.toLocaleString()} ₴
                    </div>
                </div> 
                
                <button class="btn-remove-item" onclick="window.handleRemoveCart(${productInfo.id})">Remove</button>
            </div>
        `;
    }

}

window.cart = new Cart();

export { Cart };