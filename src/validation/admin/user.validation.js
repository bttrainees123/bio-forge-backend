const Joi = require("joi");

class userValidation {
    /**
     * Returns the registration validation schema.
     * @returns {Joi.ObjectSchema}
     */
    static add() {
        return Joi.object({
            username: Joi.string()
                .min(3)
                .max(20)
                .pattern(/^\S+$/)
                .required()
                .messages({
                    "string.empty": "Name is required",
                    "string.min": 'Name must be less than characters',
                    "string.max": "Name must be at least characters long",
                    "string.pattern.base": "Username must not contain spaces",
                }),
            email: Joi.string()
                .email({ tlds: { allow: false } })
                .pattern(/^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
                .required()
                .messages({
                    "string.empty": "Email is required",
                    "string.email": "Please provide a valid email address",
                    "string.pattern.base": "Email must contain only letters digits and periods before",
                }),
            password: Joi.string()
                .min(6)
                .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'))
                .required()
                .messages({
                    'string.empty': 'Password is required',
                    'string.min': 'Password must be at least 6 characters long',
                    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                }),
            profile_img: Joi.string()
                .required()
                .messages({
                    "string.base": "Profile image must be a string",
                    "string.empty": "Profile image is required",
                }),
            banner_img: Joi.string()
                .required()
                .messages({
                    "string.base": "Profile image must be a string",
                    "string.empty": "Profile image is required",
                }),
            bio: Joi.string()
                .min(3)
                .max(1000)
                .optional()
                .messages({
                    "string.empty": "bio text is required",
                    "string.min": "bio text must be at least 3 characters long",
                    "string.max": "bio text must not exceed 1000 characters",
                }),


        });
    }
    /**
    * Returns the registration validation schema.
    * @returns {Joi.ObjectSchema}
    */
    static update() {
        return Joi.object({
            _id: Joi.string()
                .pattern(/^[a-fA-F0-9]{24}$/)
                .required()
                .messages({
                    "string.empty": "User ID is required",
                    "string.pattern.base": "Invalid User ID format Must be a valid MongoDB ObjectId",
                }),
            username: Joi.string()
                .min(3)
                .max(20)
                .pattern(/^\S+$/)
                .optional()
                .messages({
                    "string.empty": "username is required",
                    "string.min": 'username must be less than characters',
                    "string.max": "username must be at least characters long",
                    "string.pattern.base": "Username must not contain spaces",
                }),
            email: Joi.string()
                .email({ tlds: { allow: false } })
                .pattern(/^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
                .optional()
                .messages({
                    "string.empty": "Email is required",
                    "string.email": "Please provide a valid email address",
                    "string.pattern.base": "Email must contain only letters digits and periods before",
                }),
            password: Joi.string().min(6).optional().messages({
                "string.empty": "Password is required",
                "string.min": "Password must be at least 6 characters long",
            }),
            profile_img: Joi.string()
                .required()
                .messages({
                    "string.base": "Profile image must be a string",
                    "string.empty": "Profile image is required",
                }),
            banner_img: Joi.string()
                .required()
                .messages({
                    "string.base": "Profile image must be a string",
                    "string.empty": "Profile image is required",
                }),
            bio: Joi.string()
                .min(3)
                .max(1000)
                .optional()
                .messages({
                    "string.empty": "bio text is required",
                    "string.min": "bio text must be at least 3 characters long",
                    "string.max": "bio text must not exceed 1000 characters",
                }),
            status: Joi.string().valid('active', 'inactive').optional().messages({
                "string.empty": "Status either active or inactive",

            })


        });
    }

    /**
     * Validate user registration data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static validateadd(data) {
        return userValidation.add().validate(data, { abortEarly: false });
    }
    /**
     * Validate user registration data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static validateUpdate(data) {
        return userValidation.update().validate(data, { abortEarly: false });
    }


}

module.exports = userValidation;
