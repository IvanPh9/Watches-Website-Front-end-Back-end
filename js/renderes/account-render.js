import { WATCH_TYPES, WATCH_MATERIALS, WATCH_COLORS } from "../utils/constants.js";

window.renderUserProfile = function(container, user) {
    container.innerHTML = `
        <div class="account-page-wrapper">
            <div class="account-box glass-panel">
                <h3 class="account-title">Personal Information</h3>
                <form onsubmit="window.handleProfileUpdate(event)" class="account-form">
                    <div class="form-group">
                        <label>Email (Read-only)</label>
                        <input type="email" value="${user.email}" disabled class="form-control input-disabled">
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>First Name</label>
                            <p id="err-prof-firstname" class="field-error"></p>
                            <input type="text" id="prof-firstname" value="${user.firstName}" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>Last Name</label>
                            <p id="err-prof-lastname" class="field-error"></p>
                            <input type="text" id="prof-lastname" value="${user.lastName}" class="form-control" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Phone</label>
                        <p id="err-prof-phone" class="field-error"></p>
                        <input type="text" id="prof-phone" value="${user.phoneNumber}" class="form-control" required>
                    </div>
                    <button type="submit" class="btn-primary btn-full-width">Save Changes</button>
                </form>
                <p id="prof-success-msg" class="success-message" style="display:none;">Profile updated successfully!</p>
            </div>
        </div>
    `;
}
window.renderAdminDashboard = function(container, activeTab) {
    const isUsersTab = activeTab === 'users';

    const tabsHTML = `
        <div class="admin-tabs">
            <button class="admin-tab-btn ${isUsersTab ? 'active' : ''}" onclick="window.navigateAccount('users')">Manage Users</button>
            <button class="admin-tab-btn ${!isUsersTab ? 'active' : ''}" onclick="window.navigateAccount('products')">Manage Products</button>
        </div>
    `;

    container.innerHTML = `
        <div class="account-page-wrapper">
            <div class="account-box glass-panel admin-glass-panel">
                <h3 class="account-title">Admin Dashboard</h3>
                ${tabsHTML}
                <div id="admin-content-area"></div>
            </div>
        </div>
    `;
}

window.renderAdminUsers = function() {
    const container = document.getElementById('admin-content-area');
    if (!container) return;

    const users = window.auth.usersDB;
    let rowsHTML = users.map(u => `
        <tr>
            <td>${u.id}</td>
            <td>${u.firstName} ${u.lastName}</td>
            <td>${u.email}</td>
            <td><span class="role-badge ${u.role}">${u.role.toUpperCase()}</span></td>
            <td>
                ${u.role !== 'admin'
        ? `<button class="btn-delete" onclick="window.handleDeleteUser(${u.id})">Delete</button>`
        : '<span class="text-muted" style="font-size: 10pt;">Cannot delete admin</span>'}
            </td>
        </tr>
    `).join('');

    container.innerHTML = `
        <div class="table-responsive">
            <table class="admin-table">
                <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr></thead>
                <tbody>${rowsHTML}</tbody>
            </table>
        </div>
    `;
}

window.renderAdminProductsLayout = function() {
    const container = document.getElementById('admin-content-area');
    if (!container) return;

    const typeOptions = WATCH_TYPES.map(t => `<option value="${t}">${t}</option>`).join('');
    const materialOptions = WATCH_MATERIALS.map(m => `<option value="${m}">${m}</option>`).join('');
    const colorOptions = WATCH_COLORS.map(c => `<option value="${c}">${c}</option>`).join('');

    // Додано класи form-control до всіх інпутів
    container.innerHTML = `
        <div class="admin-catalog-layout">
            <div id="filters-container" class="admin-sidebar"></div>
            
            <main class="admin-main-content">
                <div id="admin-products-table-container" class="table-responsive"></div>
                
                <h4 class="account-title" style="margin-top: 40px; font-size: 18pt; border-bottom: none;">Add New Product</h4>
                <form class="account-form" onsubmit="window.handleAddProduct(event)">
                     <div class="form-row">
                        <div class="form-group flex-2"><label>Title</label><input type="text" id="new-prod-title" class="form-control" required></div>
                        <div class="form-group flex-1"><label>Price (₴)</label><input type="number" id="new-prod-price" class="form-control" min="0" required></div>
                        <div class="form-group flex-1"><label>Quantity</label><input type="number" id="new-prod-qty" class="form-control" min="1" required></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group flex-1"><label>Type</label><select id="new-prod-type" class="form-control" required><option value="">Select...</option>${typeOptions}</select></div>
                        <div class="form-group flex-1"><label>Material</label><select id="new-prod-material" class="form-control" required><option value="">Select...</option>${materialOptions}</select></div>
                        <div class="form-group flex-1"><label>Color</label><select id="new-prod-color" class="form-control" required><option value="">Select...</option>${colorOptions}</select></div>
                    </div>
                    <div class="form-row">
                        <div class="form-group" style="width: 100%;"><label>Description</label><textarea id="new-prod-description" class="form-control" rows="3"></textarea></div>
                    </div>
                    <div class="form-row" style="align-items: flex-end;">
                        <div class="form-group flex-2" style="margin-bottom: 0;"><label>Image URL</label><input type="url" id="new-prod-image-url" class="form-control"></div>
                        <div class="form-actions flex-1"><button type="submit" class="btn-primary btn-full-width" style="margin-top: 0;">Add Product</button></div>
                    </div>
                </form>
            </main>
        </div>
    `;
}

window.renderAdminProductsTable = function(items) {
    const container = document.getElementById('admin-products-table-container');
    if (!container) return;

    if (items.length === 0) {
        container.innerHTML = "<p class='no-results text-center' style='padding: 20px;'>No products found matching your criteria.</p>";
        return;
    }

    let rowsHTML = items.map(p => `
        <tr>
            <td>${p.id}</td>
            <td><img src="${p.image}" alt="${p.title}" class="admin-product-img"></td>
            <td><strong>${p.title}</strong></td>
            <td>${p.price.toLocaleString()} ₴</td>
            <td>
                <div class="admin-qty-controls">
                    <button class="btn-qty" onclick="window.handleStepQuantity(${p.id}, -1)">-</button>
                    <input type="number" class="input-qty" value="${p.quantity}" onchange="window.handleInputQuantity(${p.id}, this.value)">
                    <button class="btn-qty" onclick="window.handleStepQuantity(${p.id}, 1)">+</button>
                </div>
            </td>
            <td><button class="btn-delete" onclick="window.handleDeleteProduct(${p.id})">Delete</button></td>
        </tr>
    `).join('');

    container.innerHTML = `<table class="admin-table"><thead><tr><th>ID</th><th>Image</th><th>Title</th><th>Price</th><th>Qty</th><th>Action</th></tr></thead><tbody>${rowsHTML}</tbody></table>`;
}