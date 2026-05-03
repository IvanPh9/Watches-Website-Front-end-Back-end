window.showError = function (inputId, message) {
    const errorElement = document.getElementById('err-' + inputId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    } else {
        console.warn("Error element not found for input:", inputId);
    }
}

window.clearErrors = function() {
    document.querySelectorAll('.field-error').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
}

window.renderLoginForm = function() {
    const authContainer = document.getElementById('auth-app');
    if (!authContainer) return;

    authContainer.innerHTML = `
    <div class="auth-page-wrapper">
        <div class="auth-box glass-panel">
            <h2 class="auth-title">Login to L'HEURE</h2>
            <form onsubmit="handleLoginSubmit(event)" class="auth-form">
                <p id="err-login" class="field-error form-level-error" style="display:none;"></p>
                <div class="form-group">
                    <label for="login-email">Email</label>  
                    <input type="email" id="login-email" class="form-control" required placeholder="example@email.com">
                </div>
                <div class="form-group">
                    <label for="login-password">Password</label>
                    <input type="password" id="login-password" class="form-control" required placeholder="Enter your password">
                </div>
                <button type="submit" class="btn-primary btn-full-width">Log In</button>
            </form>
            <div class="auth-footer">
                <p>Don't have an account? <a href="auth?action=register" class="auth-link">Register here</a></p>
                <p><a href="index.html" class="auth-link back-link">← Back to Home</a></p>
            </div>
        </div>
    </div>
    `;
}

window.renderRegisterForm = function() {
    const authContainer = document.getElementById('auth-app');
    if (!authContainer) return;

    authContainer.innerHTML = `
    <div class="auth-page-wrapper">
        <div class="auth-box glass-panel">
            <h2 class="auth-title">Join the Club</h2>
            <form onsubmit="handleRegisterSubmit(event)" class="auth-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="reg-firstname">First Name</label>
                        <p id="err-reg-firstname" class="field-error" style="display:none;"></p>
                        <input type="text" id="reg-firstname" class="form-control" required placeholder="First name">
                    </div>
                    <div class="form-group">
                        <label for="reg-lastname">Last Name</label>
                        <p id="err-reg-lastname" class="field-error" style="display:none;"></p>
                        <input type="text" id="reg-lastname" class="form-control" required placeholder="Last name">
                    </div>
                </div>
                <div class="form-group">
                    <label for="reg-email">Email</label>
                    <p id="err-reg-email" class="field-error" style="display:none;"></p>
                    <input type="email" id="reg-email" class="form-control" required placeholder="example@email.com">
                </div>
                <div class="form-group">
                    <label for="reg-phone">Phone</label>
                    <p id="err-reg-phone" class="field-error" style="display:none;"></p>
                    <input type="tel" id="reg-phone" class="form-control" placeholder="+380..." required>
                </div>
                <div class="form-group">
                    <label for="reg-password">Password</label>
                    <p id="err-reg-password" class="field-error" style="display:none;"></p>
                    <input type="password" id="reg-password" class="form-control" required placeholder="Create a password">
                </div>
                <button type="submit" class="btn-primary btn-full-width">Register</button>
            </form>
            <div class="auth-footer">
                <p>Already have an account? <a href="auth?action=login" class="auth-link">Log in here</a></p>
                <p><a href="index.html" class="auth-link back-link">← Back to Home</a></p>
            </div>
        </div>
    </div>
    `;
}