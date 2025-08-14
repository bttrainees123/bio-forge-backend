const Joi = require("joi");

class imageValidation {
    /**
     * Returns the login validation schema.
     * @returns {Joi.ObjectSchema}
     */
    static upload() {
        return Joi.object({
            tempImage: Joi.object()
                .custom((value, helpers) => {
                    if (!value || !value.mimetype) {
                        return helpers.error("any.required");
                    }
                    if (!/^image\/(jpeg|png|jpg|gif|webp|avif)$/.test(value.mimetype)) {
                        return helpers.error("any.invalid");
                    }
                    if (value.size > 20 * 1024 * 1024) { // Max file size: 5MB
                        return helpers.error("any.max");
                    }
                    return value;
                })
                .required()
                .messages({
                    "any.required": "Image is required",
                    "any.invalid": "Only image files (JPG, PNG, JPEG, GIF, WEBP) are allowed",
                    "any.max": "File size must be less than 1MB"
                }),
        })
    }
    static multiUpload() {
        return Joi.object({
            tempImage: Joi.array()
                .items(
                    Joi.object()
                        .custom((value, helpers) => {
                            if (!value || !value.mimetype) {
                                return helpers.error("any.required");
                            }
                            if (!/^image\/(jpeg|png|jpg|gif|webp|avif)$/.test(value.mimetype)) {
                                return helpers.error("any.invalid");
                            }
                            if (value.size > 20 * 1024 * 1024) {
                                return helpers.error("any.max");
                            }
                            return value;
                        })
                        .required()
                )
                .min(1)
                .messages({
                    "array.min": "At least one image is required",
                    "any.required": "Image is required",
                    "any.invalid": "Only image files (JPG, PNG, JPEG, GIF, WEBP) are allowed",
                    "any.max": "File size must be less than 1MB"
                }),
        });
    }



    /**
     * Validate user login data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static validateImage(data) {
        return imageValidation.upload().validate(data, { abortEarly: false });
    }
    /**
     * Validate user login data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static validateMultiImage(data) {
        return imageValidation.multiUpload().validate(data, { abortEarly: false });
    }
}

module.exports = imageValidation;
