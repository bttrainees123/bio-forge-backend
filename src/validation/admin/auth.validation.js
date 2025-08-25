const Joi = require("joi");

class adminValidation {
    /**
     * Returns the login validation schema.
     * @returns {Joi.ObjectSchema}
     */
    static login() {
        return Joi.object({
            email: Joi.string()
                .email({ tlds: { allow: false } })
                .pattern(/^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
                .required()
                .messages({
                    "string.empty": "Email is required",
                    "string.email": "Please provide a valid email address",
                    "string.pattern.base": "Email must contain only letters, digits, and periods before @",
                }),
            password: Joi.string().required().messages({
                "string.empty": "Password is required",

            }),
        });
    }
    /**
     * Validate user login data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static validateLogin(data) {
        return adminValidation.login().validate(data, { abortEarly: false });
    }
}

module.exports = adminValidation;
