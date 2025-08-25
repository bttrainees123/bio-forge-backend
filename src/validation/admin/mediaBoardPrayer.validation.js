const Joi = require("joi");

class meidaBoardPrayerValidation {
    /**
     * Returns the validation schema for adding a record.
     * @returns {Joi.ObjectSchema}
     */
    static add() {
        return Joi.object({
            mediaCategoryId: Joi.string()
                .pattern(/^[a-fA-F0-9]{24}$/)
                .required()
                .messages({
                    "string.empty": "mediaCategoryId is required",
                    "string.pattern.base": "Invalid mediaCategoryId format. Must be a valid MongoDB ObjectId",
                }),

            topic: Joi.array()
                .items(
                    Joi.object({
                        language: Joi.string().required().messages({
                            "string.empty": "Language is required",
                        }),
                        title: Joi.string()
                            .min(3)
                            .max(50)
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
            link: Joi.string()
                .uri({ scheme: ['http', 'https'] })
                .required()
                .messages({
                    "string.empty": "Link is required",
                    "string.uri": "Please enter a valid URL",
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
                    "string.pattern.base": "Invalid _id format. Must be a valid MongoDB ObjectId",
                }),
                
            topic: Joi.array()
                .items(
                    Joi.object({
                        language: Joi.string().required().messages({
                            "string.empty": "Language is required",
                        }),
                        title: Joi.string()
                            .min(3)
                            .max(50)
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
            link: Joi.string()
                .uri({ scheme: ['http', 'https'] })
                .required()
                .messages({
                    "string.empty": "Link is required",
                    "string.uri": "Please enter a valid URL",
                }),



        });
    }
    /**
     * Validate input for adding.
     * @param {Object} data
     * @returns {Object}
     */
    static validateAdd(data) {
        return meidaBoardPrayerValidation.add().validate(data, { abortEarly: false });
    }

    /**
     * Validate input for updating.
     * @param {Object} data
     * @returns {Object}
     */
    static validateUpdate(data) {
        return meidaBoardPrayerValidation.update().validate(data, { abortEarly: false });
    }
}

module.exports = meidaBoardPrayerValidation;
