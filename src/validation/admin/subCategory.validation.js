const Joi = require("joi");

class subCategoryValidation {
    /**
     * Returns the login validation schema.
     * @returns {Joi.ObjectSchema}
     */
    static add() {
        return Joi.object({
            topic: Joi.array()
                .items(
                    Joi.object({
                        language: Joi.string().required().messages({
                            "string.empty": "Language is required",
                        }),
                        title: Joi.string()
                            .min(2)
                            .max(100)
                            .required()
                            .messages({
                                "string.empty": "Title is required",
                                "string.min": "Title must be at least 3 characters long",
                                "string.max": "Title must be less than 50 characters",
                            }),
                    })
                )
                .min(1)
                .required()
                .messages({
                    "array.min": "At least one topic is required",
                    "any.required": "Topic is required",
                }),
            image: Joi.string().required().messages({
                "string.empty": "image is required",
            }),
            parentCategoryId: Joi.string()
                .pattern(/^[a-fA-F0-9]{24}$/)
                .required()
                .messages({
                    "string.empty": "parentCategoryId is required",
                    "string.pattern.base": "Invalid parentCategoryId format. Must be a valid MongoDB ObjectId",
                }),
            key: Joi.string().required().messages({
                "string.empty": "key  is required",
            }),
            contentType: Joi.string()
                .valid("daily", "weekly", "static", "flow", "time")
                .required()
                .messages({
                    "any.only": "contentType must be either 'daily','weekly','static','flow','time",
                    "string.empty": "contentType is required",
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
                .pattern(/^[a-fA-F0-9]{24}$/)
                .required()
                .messages({
                    "string.empty": "_id is required",
                    "string.pattern.base": "Invalid _id format. Must be a valid MongoDB ObjectId",
                }),
            parentCategoryId: Joi.string()
                .pattern(/^[a-fA-F0-9]{24}$/)
                .required()
                .messages({
                    "string.empty": "parentCategoryId is required",
                    "string.pattern.base": "Invalid parentCategoryId format. Must be a valid MongoDB ObjectId",
                }),
            topic: Joi.array()
                .items(
                    Joi.object({
                        language: Joi.string().required().messages({
                            "string.empty": "Language is required",
                        }),
                        title: Joi.string()
                            .min(2)
                            .max(100)
                            .required()
                            .messages({
                                "string.empty": "Title is required",
                                "string.min": "Title must be at least 3 characters long",
                                "string.max": "Title must be less than 50 characters",
                            }),
                    })
                )
                .min(1)
                .required()
                .messages({
                    "array.min": "At least one topic is required",
                    "any.required": "Topic is required",
                }),
            status: Joi.string()
                .valid("active", "inactive") // Only allows these two values
                .required()
                .messages({
                    "any.only": "Status must be either 'active' or 'inactive'",
                    "string.empty": "Status is required",
                }),
            image: Joi.string().required().messages({
                "string.empty": "image is required",
            }),
            key: Joi.string().required().messages({
                "string.empty": "key is required",
            }),
            contentType: Joi.string()
                .valid("daily", "weekly", "static", "flow", "time")
                .required()
                .messages({
                    "any.only": "contentType must be either 'daily','weekly','static','flow','time",
                    "string.empty": "contentType is required",
                }),
        });
    }
    /**
     * Validate user login data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static validateAdd(data) {
        return subCategoryValidation.add().validate(data, { abortEarly: false });
    }
    /**
     * Validate user login data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static validateUpdate(data) {
        return subCategoryValidation.update().validate(data, { abortEarly: false });
    }
}

module.exports = subCategoryValidation;
