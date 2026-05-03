import { Validator } from "../user/validator.js";

window.handleLoginSubmit = function(event) {
    event.preventDefault();
    window.clearErrors();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    const result = window.login(email, password);
    if (result.success) {
        window.location.href = "catalog.html";
    } else {
        window.showError('login', result.error);
    }
};

window.handleRegisterSubmit = function(event) {
    event.preventDefault();
    window.clearErrors();

    const formData = {
        firstName: document.getElementById('reg-firstname').value.trim(),
        lastName: document.getElementById('reg-lastname').value.trim(),
        email: document.getElementById('reg-email').value.trim(),
        phone: document.getElementById('reg-phone').value.trim(),
        password: document.getElementById('reg-password').value
    };

    const validation = Validator.validateRegistration(formData);

    if (!validation.isValid) {
        for (const [fieldId, errorMessage] of Object.entries(validation.errors)) {
            window.showError(fieldId, errorMessage);
        }
        return;
    }

    const result = window.register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.phone,
        formData.password
    );

    if (result.success) {
        window.location.href = "catalog.html";
    } else {
        window.showError(result.field, result.error);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');

    if (action === 'register') {
        window.renderRegisterForm();
    } else {
        window.renderLoginForm();
    }
});