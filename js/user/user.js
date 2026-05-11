class User {
    #_id;
    #_email;
    #_firstName;
    #_lastName;
    #_phoneNumber;
    #_role;

    constructor(id, email, firstName, lastName, phoneNumber, role, password) {
        this.#_id = id;
        this.#_email = email;
        this.#_firstName = firstName;
        this.#_lastName = lastName;
        this.#_phoneNumber = phoneNumber;
        this.#_role = role;
    }

    toJSON() {
        return {
            id: this.#_id,
            email: this.#_email,
            firstName: this.#_firstName,
            lastName: this.#_lastName,
            phoneNumber: this.#_phoneNumber,
            role: this.#_role,
        };
    }

    get role() { return this.#_role; }
    get id() { return this.#_id; }
    get email() { return this.#_email; }
    set email(value) { this.#_email = value; }
    get firstName() { return this.#_firstName; }
    set firstName(value) { this.#_firstName = value; }
    get lastName() { return this.#_lastName; }
    set lastName(value) { this.#_lastName = value; }
    get phoneNumber() { return this.#_phoneNumber; }
    set phoneNumber(value) { this.#_phoneNumber = value; }
}

class AuthManager {
    #_currentUser;

    constructor() {
        this.#_currentUser = null;
        this.loadCurrentUser();
    }

    get currentUser() { return this.#_currentUser; }

    loadCurrentUser() {
        const userData = localStorage.getItem("currentUser");
        if (userData && userData !== "null") {
            try {
                const u = JSON.parse(userData);
                if (u && (u.email || u._email)) {
                    this.#_currentUser = new User(
                        u.id || u._id,
                        u.email || u._email,
                        u.firstName || u._firstName,
                        u.lastName || u._lastName,
                        u.phoneNumber || u._phoneNumber || u.phone,
                        u.role || u._role
                    );
                }
            } catch (e) { console.error("Error parsing currentUser:", e); }
        }
    }

    setCurrentUser(user) {
        this.#_currentUser = user;
        localStorage.setItem("currentUser", JSON.stringify(user));
    }

    isLoggedIn() {
        return this.#_currentUser !== null;
    }

    logout() {
        this.#_currentUser = null;
        localStorage.removeItem("currentUser");
        window.location.href = "catalog.html";
    }

    async updateUserData(newData) {
        if (!this.#_currentUser) return { success: false, error: "Not logged in" };

        try {
            const response = await fetch(`http://localhost:3000/api/users/${this.#_currentUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update profile");
            }

            this.#_currentUser.firstName = data.firstName;
            this.#_currentUser.lastName = data.lastName;
            this.#_currentUser.phoneNumber = data.phone;

            localStorage.setItem("currentUser", JSON.stringify(this.#_currentUser));

            return { success: true };
        } catch (error) {
            console.error("Update error:", error);
            return { success: false, error: error.message };
        }
    }
}

export { User, AuthManager };
window.auth = new AuthManager();