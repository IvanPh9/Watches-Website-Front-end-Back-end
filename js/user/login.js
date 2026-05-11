import { User } from "./user.js";

window.login = async function(email, password) {
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.error };
        }

        const user = new User(data.id, data.email, data.firstName, data.lastName, data.phone, data.role);

        window.auth.setCurrentUser(user);
        return { success: true };

    } catch (error) {
        console.error("Помилка логіну:", error);
        return { success: false, error: "Server connection failed." };
    }
}