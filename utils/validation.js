// validation.js

// Validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password length and complexity
function validatePassword(password) {
    // Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
    return passwordRegex.test(password);
}

// Validate alphanumeric string (letters and numbers only)
function validateAlphaNumeric(input) {
    const alphaNumericRegex = /^[a-zA-Z0-9]+$/;
    return alphaNumericRegex.test(input);
}

// Validate integer number
function validateInteger(input) {
    const integerRegex = /^-?\d+$/;
    return integerRegex.test(input);
}

// Validate positive integer number
function validatePositiveInteger(input) {
    const positiveIntegerRegex = /^\d+$/;
    return positiveIntegerRegex.test(input);
}

// Validate URL format
function validateURL(url) {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    return urlRegex.test(url);
}

// Validate date format (YYYY-MM-DD)
function validateDate(date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(date);
}

// Validate phone number (assuming US format XXX-XXX-XXXX)
function validatePhoneNumber(phoneNumber) {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
    return phoneRegex.test(phoneNumber);
}

module.exports = {
    validateEmail,
    validatePassword,
    validateAlphaNumeric,
    validateInteger,
    validatePositiveInteger,
    validateURL,
    validateDate,
    validatePhoneNumber,
};
