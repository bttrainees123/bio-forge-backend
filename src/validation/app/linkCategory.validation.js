const Joi = require("joi");

class linkCategoryValidation {
    /**
     * Returns the registration validation schema.
     * @returns {Joi.ObjectSchema}
     */
    static add() {
        return Joi.object({
            title: Joi.string()
                .min(2)
                .max(50)
                .optional()
                .messages({
                    "string.min": " title must be at least 2 characters long",
                    "string.max": " title must be at most 50 characters long",
                }),
            image: Joi.string()
                .optional()
                .messages({
                    "string.empty": "Link logo URL cannot be empty",
                }),
            link: Joi.string()
                .optional()
                .messages({
                    "string.empty": "video URL cannot be empty",
                }),
        });

    }
    static update() {
        return Joi.object({
            _id: Joi.string()
                .required()
                .messages({
                    "string.empty": "ID is required",
                }),
            title: Joi.string()
                .min(2)
                .max(50)
                .optional()
                .messages({
                    "string.min": " title must be at least 2 characters long",
                    "string.max": " title must be at most 50 characters long",
                }),
            image: Joi.string()
                .optional()
                .messages({
                    "string.empty": "Link logo URL cannot be empty",
                }),
            link: Joi.string()
                .optional()
                .messages({
                    "string.empty": "video URL cannot be empty",
                }),
        });

    }




    /**
     * Validate user link data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static validateAddvideo(data) {
        return linkCategoryValidation.add().validate(data, { abortEarly: false });
    }
    static validateUpdatevideo(data) {
        return linkCategoryValidation.update().validate(data, { abortEarly: false });
    }


}

module.exports = linkCategoryValidation;
