const Joi = require("joi");

class contactValidation {
    static add() {
        return Joi.object({
            name: Joi.string().min(3).max(50).required().messages({
                "string.empty": "Name is required",
                "string.min": "Name must be at least 3 characters long",
                "string.max": "Name must be less than 50 characters",
            }),
            countryCode: Joi.string()
                .pattern(/^\d{1,9}$/)
                .required()
                .messages({
                    "string.empty": "Country Code is required",
                    "string.pattern.base": "Country code must be between 1 to 4 digits",
                }),
            phoneNumber: Joi.string()
                .min(8)
                .max(15)
                .pattern(/^\d+$/) // Ensures only numbers
                .required()
                .messages({
                    "string.empty": "Phone number is required",
                    "string.min": "Phone number must be at least 8 digits",
                    "string.max": "Phone number must not exceed 15 digits",
                    "string.pattern.base": "Phone number must contain only digits",
                }),

            email: Joi.string()
                .email({ tlds: { allow: false } })
                .pattern(/^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
                .required()
                .messages({
                    "string.empty": "Email is required",
                    "string.email": "Please provide a valid email address",
                    "string.pattern.base": "Email must contain only letters, digits, and periods before @",
                }),
            subject: Joi.string().required().messages({
                "string.empty": "subject is required",

            }),


        });
    }
    /**
     * Validate user checkout input data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static validateAdd(data) {
        return contactValidation.add().validate(data, { abortEarly: false });
    }
}

module.exports = contactValidation;
