const Joi = require("joi");
class mediaValidation {
    static add() {
        return Joi.object({
            title: Joi.string()
                .min(3)
                .required()
                .messages({
                    "string.empty": "title is required",
                    "string.min": "Title must be at least 3 characters long",
                }),
            link: Joi.string()
                .uri({ scheme: ['http', 'https'] })
                .required()
                .messages({
                    "string.empty": "Link is required",
                    "string.uri": "Please enter a valid URL",
                }),

        });
    }
    static update() {
        return Joi.object({
            title: Joi.string()
                .min(3)
                .required()
                .messages({
                    "string.empty": "title is required",
                    "string.min": "Title must be at least 3 characters long",
                }),
            link: Joi.string()
                .uri({ scheme: ['http', 'https'] })
                .required()
                .messages({
                    "string.empty": "Link is required",
                    "string.uri": "Please enter a valid URL",
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
     * Validate user login data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static validAddMedia(data) {
        return mediaValidation.add().validate(data, { abortEarly: false });
    }
    /**
     * Validate user login data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static validUpdateMedia(data) {
        return mediaValidation.update().validate(data, { abortEarly: false });
    }

}

module.exports = mediaValidation;
