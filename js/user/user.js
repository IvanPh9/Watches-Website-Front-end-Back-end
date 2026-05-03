class User {
    #_id;
    #_email;
    #_firstName;
    #_lastName;
    #_phoneNumber;
    #_role;
    #_password;

    constructor(id, email, firstName, lastName, phoneNumber, role, password) {
        this.#_id = id;
        this.#_email = email;
        this.#_firstName = firstName;
        this.#_lastName = lastName;
        this.#_phoneNumber = phoneNumber;
        this.#_role = role;
        this.#_password = password;
    }

    toJSON() {
        return {
            id: this.#_id,
            email: this.#_email,
            firstName: this.#_firstName,
            lastName: this.#_lastName,
            phoneNumber: this.#_phoneNumber,
            role: this.#_role,
            password: this.#_password
        };
    }
    get password() { return this.#_password; }
    set password(value) { this.#_password = value; }
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
    #_usersDB;

    constructor() {
        this.#_currentUser = null;
        this.#_usersDB = [];
        this.loadDatabase();
        this.loadCurrentUser();
    }

    get currentUser() { return this.#_currentUser; }
    get usersDB() { return this.#_usersDB; }

    addUser(user) {
        this.#_usersDB.push(user);
        this.saveDatabase();
    }

    saveDatabase() {
        localStorage.setItem("usersDB", JSON.stringify(this.#_usersDB));
    }

    loadDatabase() {
        const db = localStorage.getItem("usersDB");
        if (db && db !== "null") {
            try {
                const parsed = JSON.parse(db);
                this.#_usersDB = parsed.map(u => new User(
                    u.id || u._id,
                    u.email || u._email,
                    u.firstName || u._firstName,
                    u.lastName || u._lastName,
                    u.phoneNumber || u._phoneNumber || u.phone,
                    u.role || u._role,
                u.password || u._password
                ));
            } catch (e) { console.error("Error parsing usersDB:", e); }
        } else {
            const defaultUser = new User(1, "vaniko.vstaniko@gmail.com", "Vaniko", "Vstaniko", "+380123456789", "admin", "123456");
            this.#_usersDB.push(defaultUser);
            this.saveDatabase();
        }
    }

    loadCurrentUser() {
        const userData = localStorage.getItem("currentUser");
        if (userData && userData !== "null") {
            try {
                const u = JSON.parse(userData);
                // Така сама "всеїдна" перевірка
                if (u && (u.email || u._email)) {
                    this.#_currentUser = new User(
                        u.id || u._id,
                        u.email || u._email,
                        u.firstName || u._firstName,
                        u.lastName || u._lastName,
                        u.phoneNumber || u._phoneNumber || u.phone,
                        u.role || u._role,
                    u.password || u._password
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
    }

    updateUserData(newData) {
        if (!this.#_currentUser) return { success: false, error: "Not logged in" };

        const index = this.#_usersDB.findIndex(u => Number(u.id) === Number(this.#_currentUser.id));
        if (index !== -1) {
            this.#_usersDB[index].firstName = newData.firstName;
            this.#_usersDB[index].lastName = newData.lastName;
            this.#_usersDB[index].phoneNumber = newData.phone;
            this.saveDatabase();

            this.#_currentUser.firstName = newData.firstName;
            this.#_currentUser.lastName = newData.lastName;
            this.#_currentUser.phoneNumber = newData.phone;

            localStorage.setItem("currentUser", JSON.stringify(this.#_currentUser));
            return { success: true };
        }
        return { success: false, error: "User not found in database." };
    }

    deleteUser(userId) {
        if (!this.#_currentUser || this.#_currentUser.role !== 'admin') {
            return { success: false, error: "Access denied. Admins only." };
        }
        if (Number(this.#_currentUser.id) === Number(userId)) {
            return { success: false, error: "You cannot delete yourself!" };
        }

        this.#_usersDB = this.#_usersDB.filter(u => Number(u.id) !== Number(userId));
        this.saveDatabase();
        return { success: true };
    }

    dropDatabase() {
        this.#_usersDB = [];
        this.saveDatabase();
        this.logout();
    }
}

export { User, AuthManager };
window.auth = new AuthManager();