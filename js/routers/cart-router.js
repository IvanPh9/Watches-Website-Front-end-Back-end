document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const isLoggedIn = window.auth ? window.auth.isLoggedIn() : false;

        if (!isLoggedIn) {
            window.location.href = "catalog.html";
            return;
        }

        renderCartPage();
    }, 50);
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