const Joi = require("joi");

class authValidation {
    /**
     * Returns the registration validation schema.
     * @returns {Joi.ObjectSchema}
     */
    static register() {
        return Joi.object({
            username: Joi.string()
                .min(3)
                .max(20)
                .pattern(/^\S+$/)
                .required()
                .messages({
                    "string.empty": "Name is required",
                    "string.min": 'Name must be less than characters',
                    "string.max": "Name must be at least characters long",
                    "string.pattern.base": "Username must not contain spaces",
                }),
            // profile_img: Joi.string()
            //     .required()
            //     .messages({
            //         "string.base": "Profile image must be a string",
            //         "string.empty": "Profile image is required",
            //     }),
            // bio: Joi.string()
            //     .min(3)
            //     .max(1000)
            //     .required()
            //     .messages({
            //         "string.empty": "bio text is required",
            //         "string.min": "bio text must be at least 3 characters long",
            //         "string.max": "bio text must not exceed 1000 characters",
            //     }),
            // theme: Joi.any().optional().messages({
            //     "any.required": "Theme is required",
            // }),
            email: Joi.string()
                .email({ tlds: { allow: false } })
                .pattern(/^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
                .required()
                .messages({
                    "string.empty": "Email is required",
                    "string.email": "Please provide a valid email address",
                    "string.pattern.base": "Email must contain only letters digits and periods before",
                }),
            password: Joi.string()
                .min(6)
                .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'))
                .required()
                .messages({
                    'string.empty': 'Password is required',
                    'string.min': 'Password must be at least 6 characters long',
                    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                }),

        });
    }

    /**
     * Returns the login validation schema.
     * @returns {Joi.ObjectSchema}
     */
    static login() {
        return Joi.object({
            email: Joi.string()
                .email({ tlds: { allow: false } })
                .pattern(/^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
                .required()
                .messages({
                    "string.empty": "Email is required",
                    "string.email": "Please provide a valid email address",
                    "string.pattern.base": "Email must contain only letters digits and periods before",
                }),
            password: Joi.string().required().messages({
                "string.empty": "Password is required",
            }),
        });
    }
    /**
     * Returns the login validation schema.
     * @returns {Joi.ObjectSchema}
     */
    static sendOtp() {
        return Joi.object({
            email: Joi.string()
                .email({ tlds: { allow: false } })
                .pattern(/^[a-zA-Z0-9.]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
                .required()
                .messages({
                    "string.empty": "Email is required",
                    "string.email": "Please provide a valid email address",
                    "string.pattern.base": "Email must contain only letters digits and periods before",
                }),
            type: Joi.string()
                .valid("forget")
                .required()
                .messages({
                    "any.only": "type must be either forget",
                    "string.empty": "type is required",
                }),
        });
    }
    /**
     * Returns the login validation schema.
     * @returns {Joi.ObjectSchema}
     */

    static forgetPassword() {
        return Joi.object({
            userId: Joi.string()
                .pattern(/^[a-fA-F0-9]{24}$/)
                .required()
                .messages({
                    "string.empty": "User ID is required",
                    "string.pattern.base": "Invalid User ID format Must be a valid MongoDB ObjectId",
                }),
            password: Joi.string().min(6).required().messages({
                "string.empty": "Password is required",
                "string.min": "Password must be at least 6 characters long",
            }),
        });
    }
    /**
     * Returns the login validation schema.
     * @returns {Joi.ObjectSchema}
     */

    static verifyOpt() {
        return Joi.object({
            type: Joi.string()
                .valid("forget")
                .required()
                .messages({
                    "any.only": "type must be either forget",
                    "string.empty": "type is required",
                }),
            userId: Joi.string()
                .pattern(/^[a-fA-F0-9]{24}$/)
                .required()
                .messages({
                    "string.empty": "User ID is required",
                    "string.pattern.base": "Invalid User ID format Must bbe a valid MongoDB ObjectId",
                }),
            otp: Joi.string()
                .length(6)
                .pattern(/^\d+$/)
                .required()
                .messages({
                    "string.empty": "OTP is required",
                    "string.length": "OTP must be exactly 6 digits",
                    "string.pattern.base": "OTP must contain only digits",
                }),


        });
    }
    static changePassword() {
        return Joi.object({
            oldPassword: Joi.string().required().min(6).messages({
                "string.empty": "OldPassword is required",
                "string.min": "Old Password must be at least 6 characters long",
            }),
            newPassword: Joi.string().required().min(6)
                .messages({
                    "string.empty": "NewPassword is required",
                    "string.min": "New Password must be at least 6 characters long",
                }),


        });
    }
    static accountDelete() {
        return Joi.object({
            password: Joi.string().required().messages({
                "string.empty": "Password is required",
            }),



        });
    }
    static updateProfile() {
        return Joi.object({
            _id: Joi.string()
                .required()
                .messages({
                    "string.empty": "ID is required",
                }),
            profile_img: Joi.string()
                .required()
                .messages({
                    "string.base": "Profile image must be a string",
                    "string.empty": "Profile image is required",
                }),
            banner_img: Joi.string()
                .required()
                .messages({
                    "string.base": "Profile image must be a string",
                    "string.empty": "Profile image is required",
                }),
            bio: Joi.string()
                .min(3)
                .max(1000)
                .required()
                .messages({
                    "string.empty": "bio text is required",
                    "string.min": "bio text must be at least 3 characters long",
                    "string.max": "bio text must not exceed 1000 characters",
                }),
            theme: Joi.any().optional().messages({
                "any.required": "Theme is required",
            }),
            protectedLinksPassword: Joi.string()
                .min(6)
                .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'))
                .optional()
                .messages({
                    'string.empty': 'Password is required',
                    'string.min': 'Password must be at least 6 characters long',
                    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
                }),
            })
    }




    /**
     * Validate user registration data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static validateRegister(data) {
        return authValidation.register().validate(data, { abortEarly: false });
    }

    /**
     * Validate user login data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static validateLogin(data) {
        return authValidation.login().validate(data, { abortEarly: false });
    }
    /**
  * Validate user forget password data.
  * @param {Object} data - The user input data.
  * @returns {Object} - Validation result.
  */

    static validateSendOtp(data) {
        return authValidation.sendOtp().validate(data, { abortEarly: false });
    }
    /**
  * Validate user forget password data.
  * @param {Object} data - The user input data.
  * @returns {Object} - Validation result.
  */

    static validateForgetPassword(data) {
        return authValidation.forgetPassword().validate(data, { abortEarly: false });
    }
    /**
  * Validate user forget password data.
  * @param {Object} data - The user input data.
  * @returns {Object} - Validation result.
  */

    static validateVerifyOpt(data) {
        return authValidation.verifyOpt().validate(data, { abortEarly: false });
    }
    /**
  * Validate user forget password data.
  * @param {Object} data - The user input data.
  * @returns {Object} - Validation result.
  */

    static validateChangePassword(data) {
        return authValidation.changePassword().validate(data, { abortEarly: false });
    }
    /**
  * Validate user forget password data.
  * @param {Object} data - The user input data.
  * @returns {Object} - Validation result.
  */

    static validateAccountDelete(data) {
        return authValidation.accountDelete().validate(data, { abortEarly: false });
    }
    static validateUpdateProfile(data) {
        return authValidation.updateProfile().validate(data, { abortEarly: false });
    }
}

module.exports = authValidation;
