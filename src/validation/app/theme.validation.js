const Joi = require("joi");

class templateValidation {
    /**
     * Returns the registration validation schema.
     * @returns {Joi.ObjectSchema}
     */
    static add() {
    return Joi.object({
        templateName: Joi.string()
            .min(1)
            .max(255)
            .trim()
            .required()
            .messages({
                "string.empty": "Template name is required",
                "string.min": "Template name cannot be empty",
                "string.max": "Template name is too long (max 255 characters)",
                "any.required": "Template name is required"
            }),
        templateContent: Joi.string()
            .min(1)
            .max(500000) 
            .required()
            .messages({
                "string.empty": "Template content is required",
                "string.min": "Template content cannot be empty",
                "string.max": "Template content is too large (max 500000 characters)",
                "any.required": "Template content is required"
            })
    });
}




    /**
     * Validate user link data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static validateAddTemplate(data) {
        return templateValidation.add().validate(data, { abortEarly: false });
    }


}

module.exports = templateValidation;
