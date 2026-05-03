class Validator {
    static validateRegistration(data) {
        const errors = {};

        const nameRegex = /^[A-Za-zА-Яа-яІіЇїЄєҐґ]+$/;
        const phoneRegex = /^\+?\d{10,15}$/;
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

        if (!nameRegex.test(data.firstName)) {
            errors['reg-firstname'] = "Only letters allowed, no spaces.";
        }

        if (!nameRegex.test(data.lastName)) {
            errors['reg-lastname'] = "Only letters allowed, no spaces.";
        }

        if (!phoneRegex.test(data.phone)) {
            errors['reg-phone'] = "Enter a valid phone number (e.g. +380123456789).";
        }

        if (!passRegex.test(data.password)) {
            errors['reg-password'] = "Min 6 chars: 1 uppercase, 1 lowercase, 1 number.";
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    }

    static validateProfileUpdate(data) {
        const errors = {};
        const nameRegex = /^[A-Za-zА-Яа-яІіЇїЄєҐґ]+$/;
        const phoneRegex = /^\+?\d{10,15}$/;

        if (!nameRegex.test(data.firstName)) {
            errors['prof-firstname'] = "Only letters allowed, no spaces.";
        }
        if (!nameRegex.test(data.lastName)) {
            errors['prof-lastname'] = "Only letters allowed, no spaces.";
        }
        if (!phoneRegex.test(data.phone)) {
            errors['prof-phone'] = "Enter a valid phone number.";
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    }
}

export { Validator };