import { User } from "./user.js";

window.register = async function(firstName, lastName, email, phone, password) {
    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ firstName, lastName, email, phone, password })
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, error: data.error, field: "reg-email" };
        }

        const newUser = new User(data.id, data.email, data.first_name, data.last_name, data.phone_number, data.role);

        window.auth.setCurrentUser(newUser);
        return { success: true };

    } catch (error) {
        console.error("Помилка реєстрації:", error);
        return { success: false, error: "Server connection failed." };
    }
}