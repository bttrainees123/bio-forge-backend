const Joi = require("joi");

class languageValidation {
    /**
     * Returns the login validation schema.
     * @returns {Joi.ObjectSchema}
     */
    static add() {
        return Joi.object({
            name: Joi.string()
                .min(3)
                .max(50)
                .required()
                .messages({
                    "string.empty": "Name is required",
                    "string.min": "Name must be at least 3 characters long",
                    "string.max": "Name must be less than 50 characters",
                  
                }),
            code: Joi.string()
                .min(2)
                .max(10)
                .required()
                .messages({
                    "string.empty": "code is required",
                    "string.min": "code must be at least 2 characters long",
                    "string.max": "code must be less than 10 characters",
                  
                }),
        });
    }
    /**
     * Returns the login validation schema.
     * @returns {Joi.ObjectSchema}
     */
    static update() {
        return Joi.object({
            _id: Joi.string()
                .required()
                .messages({
                    "string.empty": "_id is required",
                
                }),
            name: Joi.string()
                .min(3)
                .max(50)
                .required()
                .messages({
                    "string.empty": "Name is required",
                    "string.min": "Name must be at least 3 characters long",
                    "string.max": "Name must be less than 50 characters",
                }),
            code: Joi.string()
                .min(2)
                .max(10)
                .required()
                .messages({
                    "string.empty": "code is required",
                    "string.min": "code must be at least 2 characters long",
                    "string.max": "code must be less than 10 characters",
                }),
            status: Joi.string()
                .valid("active", "inactive") // Only allows these two values
                .required()
                .messages({
                    "any.only": "Status must be either 'active' or 'inactive'",
                    "string.empty": "Status is required",
                }),
        });
    }
    /**
     * Validate user login data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static validateAdd(data) {
        return languageValidation.add().validate(data, { abortEarly: false });
    }
    /**
     * Validate user login data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static validateUpdate(data) {
        return languageValidation.update().validate(data, { abortEarly: false });
    }
}

module.exports = languageValidation;
