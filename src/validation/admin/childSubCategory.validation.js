const Joi = require("joi");

class childSubCategoryvalidation {
    /**
     * Returns the holyMassKeyAdd validation schema.
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
                        title: Joi.string().allow('').optional(),
                        description: Joi.string().required().messages({
                            "string.empty": "description is required",
                            "string.min": "description must be at least 3 characters long",
                        }),
                    })
                )
                .min(1)
                .required()
                .messages({
                    "array.min": "At least one topic is required",
                    "any.required": "Topic is required",
                }),
            childCategoryId: Joi.string()
                .pattern(/^[a-fA-F0-9]{24}$/)
                .required()
                .messages({
                    "string.empty": "subCategoryId is required",
                    "string.pattern.base":
                        "Invalid subCategoryId format. Must be a valid MongoDB ObjectId",
                }),

        });
    }
    /**
     * Returns the holyMassKeyAdd validation schema.
     * @returns {Joi.ObjectSchema}
     */
    static update() {
        return Joi.object({
            _id: Joi.string()
                .pattern(/^[a-fA-F0-9]{24}$/)
                .required()
                .messages({
                    "string.empty": "_id is required",
                    "string.pattern.base":
                        "Invalid _id format. Must be a valid MongoDB ObjectId",
                }),
            topic: Joi.array()
                .items(
                    Joi.object({
                        language: Joi.string().required().messages({
                            "string.empty": "Language is required",
                        }),
                        title: Joi.string().allow('').optional(),
                        description: Joi.string().required().messages({
                            "string.empty": "description is required",
                            "string.min": "description must be at least 3 characters long",
                        }),
                    })
                )
                .min(1)
                .required()
                .messages({
                    "array.min": "At least one topic is required",
                    "any.required": "Topic is required",
                }),
            childCategoryId: Joi.string()
                .pattern(/^[a-fA-F0-9]{24}$/)
                .required()
                .messages({
                    "string.empty": "subCategoryId is required",
                    "string.pattern.base":
                        "Invalid subCategoryId format. Must be a valid MongoDB ObjectId",
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
        return childSubCategoryvalidation
            .add()
            .validate(data, { abortEarly: false });
    }
    /**
     * Validate user login data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static validateUpdate(data) {
        return childSubCategoryvalidation
            .update()
            .validate(data, { abortEarly: false });
    }
}

module.exports = childSubCategoryvalidation;
