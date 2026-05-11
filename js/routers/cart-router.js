document.addEventListener("DOMContentLoaded", async () => {
    const isLoggedIn = window.auth ? window.auth.isLoggedIn() : false;

    if (!isLoggedIn) {
        window.location.href = "catalog.html";
        return;
    }

    if (window.catalog) {
        await window.catalog.loadFromStorage();

        if (window.cart) {
            window.cart.verifyCart();
        }
    }

    if (typeof window.renderCartPage === 'function') {
        window.renderCartPage();
    }
});


window.handleUpdateCart = function(productId, newQuantity) {
    const result = window.cart.updateQuantity(productId, newQuantity);

    if (!result.success) {
        alert(result.error);
    }

    window.renderCartPage();
}

window.handleRemoveCart = function(productId) {
    window.cart.removeItem(productId);
    window.renderCartPage();
}