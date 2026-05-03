window.renderCartPage = function() {
    const cartContainer = document.getElementById('cart-content');

    if (!window.cart || window.cart.items.length === 0) {
        cartContainer.innerHTML = `
            <div class="glass-panel cart-glass-panel text-center">
                <p class="cart-empty-message">Your cart is currently empty.</p>
                <a href="catalog.html" class="btn-primary" style="display: inline-block; margin-top: 20px;">Continue Shopping</a>
            </div>
        `;
        return;
    }

    let html = '<div class="glass-panel cart-glass-panel"><div class="cart-items-list">';
    let totalPrice = 0;

    window.cart.items.forEach(cartItem => {
        const productInfo = window.catalog ? window.catalog.getById(cartItem.productId) : null;

        if (productInfo) {
            if (cartItem.quantity > productInfo.quantity) {
                cartItem.quantity = productInfo.quantity;
                window.cart.updateQuantity(cartItem.productId, cartItem.quantity);
            }
            totalPrice += productInfo.price * cartItem.quantity;
            html += window.cart.renderCartItem(cartItem, productInfo);
        } else {
            window.cart.removeItem(cartItem.productId);
        }
    });

    html += `</div>
        <div class="cart-summary">
            <strong class="cart-total-amount">Total Amount: <span class="accent-color">${totalPrice.toLocaleString()} ₴</span></strong>
        </div>
        <div class="cart-checkout-actions">
            <button class="btn-primary btn-large" onclick="alert('Checkout process initialized!')">Proceed to Checkout</button>
        </div>
    </div>`;

    cartContainer.innerHTML = html;
}