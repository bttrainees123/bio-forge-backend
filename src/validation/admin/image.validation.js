const Joi = require("joi");

class imageValidation {
    /**
     * Returns the add validation schema.
     * @returns {Joi.ObjectSchema}
     */
    static add() {
        return Joi.object({
            subCategoryId: Joi.string()
                .pattern(/^[a-fA-F0-9]{24}$/)
                .required()
                .messages({
                    "string.empty": "subCategoryId is required",
                    "string.pattern.base": "Invalid subCategoryId format. Must be a valid MongoDB ObjectId",
                }),

            images: Joi.array()
                .items(
                    Joi.object({
                        image: Joi.string().required().messages({
                            "string.empty": "image is required",
                        }),

                    })
                )
                .min(1)
                .required()
                .messages({
                    "array.min": "At least one images is required",
                    "any.required": "images is required",
                }),
            date: Joi
                .optional(),
            week: Joi
                .optional()
        });
    }
    /**
     * Returns the add validation schema.
     * @returns {Joi.ObjectSchema}
     */
    static update() {
        return Joi.object({
            subCategoryId: Joi.string()
                .pattern(/^[a-fA-F0-9]{24}$/)
                .required()
                .messages({
                    "string.empty": "subCategoryId is required",
                    "string.pattern.base": "Invalid subCategoryId format. Must be a valid MongoDB ObjectId",
                }),

            images: Joi.array()
                .items(
                    Joi.object({
                        image: Joi.string().required().messages({
                            "string.empty": "image is required",
                        }),
                        _id: Joi.string()
                            .pattern(/^[a-fA-F0-9]{24}$/)
                            .messages({
                                "string.empty": "_id is required",
                                "string.pattern.base": "Invalid _id format. Must be a valid MongoDB ObjectId",
                            }),
                        date: Joi
                            .optional(),
                        week: Joi
                            .optional()
                    })
                )
                .min(1)
                .required()
                .messages({
                    "array.min": "At least one images is required",
                    "any.required": "images is required",
                }),
            _id: Joi.string()
                .pattern(/^[a-fA-F0-9]{24}$/)
                .required()
                .messages({
                    "string.empty": "_id is required",
                    "string.pattern.base": "Invalid _id format. Must be a valid MongoDB ObjectId",
                }),

        });
    }
    /**
     * Validate user add data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static validateadd(data) {
        return imageValidation.add().validate(data, { abortEarly: false });
    }
    /**
     * Validate user add data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static validateUpdate(data) {
        return imageValidation.update().validate(data, { abortEarly: false });
    }
}

module.exports = imageValidation;
