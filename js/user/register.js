import { User } from "./user.js";

window.register = function(firstName, lastName, email, phone, password) {

    if ( window.auth.usersDB.find(u => u.email === email)) {
        return { success: false, error: "This email is already registered.", field: "reg-email" };
    }

    const newUserRecord = new User(
        Date.now(),
        email,
        firstName,
        lastName,
        phone,
        "user",
        password
    );

    window.auth.addUser(newUserRecord);
    const newUser = window.auth.usersDB.find(u => u.email === email);
    window.auth.setCurrentUser(newUser);

    return { success: true };
}