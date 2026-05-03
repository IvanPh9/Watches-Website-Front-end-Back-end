import { User } from "./user.js";

window.login = function(email, password) {

    console.log(window.auth.usersDB);
    const foundUser = window.auth.usersDB.find(u => u.email === email && u.password === password);

    if (foundUser) {
        const newUser = new User(
            foundUser.id,
            foundUser.email,
            foundUser.firstName,
            foundUser.lastName,
            foundUser.phoneNumber,
            foundUser.role
        );
        window.auth.setCurrentUser(newUser);
        return { success: true };
    }

    return { success: false, error: "Invalid email or password." };
}