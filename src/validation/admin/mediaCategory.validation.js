const Joi = require("joi");

class mediaCtegoryValidation {
    /**
     * Returns the validation schema for adding a record.
     * @returns {Joi.ObjectSchema}
     */
    static add() {
        return Joi.object({
           
            image: Joi.array()
                .items(
                    Joi.object({
                        imageName: Joi.string().required().messages({
                            "string.empty": "imageName is required"
                        }),
                        language: Joi.string().required().messages({
                            "string.empty": "language is required"
                        })
                    })
                )
                .min(1)
                .required()
                .messages({
                    "array.min": "At least one image is required",
                    "any.required": "image is required"
                }),

            status: Joi.string()
                .valid("active", "inactive")
                .default("active")
                .messages({
                    "any.only": "status must be 'active' or 'inactive'"
                }),

          
        });
    }

    /**
     * Returns the validation schema for updating a record.
     * @returns {Joi.ObjectSchema}
     */
    static update() {
        return Joi.object({
            _id: Joi.string()
                .pattern(/^[a-fA-F0-9]{24}$/)
                .required()
                .messages({
                    "string.empty": "_id is required",
                    "string.pattern.base": "Invalid _id format. Must be a valid MongoDB ObjectId"
                }),


            image: Joi.array()
                .items(
                    Joi.object({
                        imageName: Joi.string().required().messages({
                            "string.empty": "imageName is required"
                        }),
                        language: Joi.string().required().messages({
                            "string.empty": "language is required"
                        })
                    })
                )
                .min(1)
                .required()
                .messages({
                    "array.min": "At least one image is required",
                    "any.required": "image is required"
                }),

            status: Joi.string()
                .valid("active", "inactive")
                .messages({
                    "any.only": "status must be 'active' or 'inactive'"
                }),
        });
    }

    /**
     * Validate input for adding.
     * @param {Object} data
     * @returns {Object}
     */
    static validateAdd(data) {
        return mediaCtegoryValidation.add().validate(data, { abortEarly: false });
    }

    /**
     * Validate input for updating.
     * @param {Object} data
     * @returns {Object}
     */
    static validateUpdate(data) {
        return mediaCtegoryValidation.update().validate(data, { abortEarly: false });
    }
}

module.exports = mediaCtegoryValidation;
