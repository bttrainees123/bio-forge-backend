const Joi = require("joi");

class reportValidation {
    /**
     * Returns the registration validation schema.
     * @returns {Joi.ObjectSchema}
     */
    static report() {
        return Joi.object({
            reportedUserId: Joi.string()
                .pattern(/^[a-fA-F0-9]{24}$/)
                .required()
                .messages({
                    "string.empty": "User ID is required",
                    "string.pattern.base": "Invalid User ID format Must be a valid MongoDB ObjectId",
                }),
                message: Joi.string()
                .min(3)
                .max(1000)
                .required()
                .messages({
                    "string.empty": "message  is required",
                    "string.min": "message  must be at least 3 characters long",
                    "string.max": "message  must not exceed 1000 characters",
                }),
        });
    }


    /**
     * Validate user link data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static validateAddLinks(data) {
        return reportValidation.report().validate(data, { abortEarly: false });
    }


}

module.exports = reportValidation;
