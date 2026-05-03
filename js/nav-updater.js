document.addEventListener("DOMContentLoaded", () => {

    const navList = document.querySelector(".main-nav ul");
    if (!navList) return;

    const isLoggedIn = window.auth ? window.auth.isLoggedIn() : false;

    const loginLink = navList.querySelector('a[href="auth.html"]');
    const loginListItem = loginLink ? loginLink.parentElement : null;

    if (isLoggedIn) {

        if (loginListItem) {
            loginListItem.remove();
        }

        if (!navList.querySelector('a[href="account.html"]')) {
            const accountLi = document.createElement("li");
            accountLi.innerHTML = `<a href="account.html" class="nav-account">Account</a>`;
            navList.appendChild(accountLi);
        }

        if (!navList.querySelector('a[href="cart.html"]')) {
            const cartLi = document.createElement("li");
            cartLi.innerHTML = `<a href="cart.html" class="nav-cart">Cart</a>`;
            navList.appendChild(cartLi);
        }

        const logoutLi = document.createElement("li");
        logoutLi.innerHTML = `<a href="#" id="logout-btn" >Logout</a>`;
        navList.appendChild(logoutLi);

        document.getElementById("logout-btn").addEventListener("click", (e) => {
            e.preventDefault();
            window.auth.logout();
            window.location.reload();
        });

    } else {

        if (!loginListItem) {
            const loginLi = document.createElement("li");
            loginLi.innerHTML = `<a href="auth.html" class="nav-btn-login">Join the Club</a>`;
            navList.appendChild(loginLi);
        }
    }
});