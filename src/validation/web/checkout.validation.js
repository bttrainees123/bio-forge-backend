const Joi = require("joi");
class checkoutValidation {
    static payment() {
        return Joi.object({
            amount: Joi.string()
                .valid(99,399,995.17,1825.17)
                .required()
                .messages({
                    "any.only": "amount must be either 99, 399, 995.17 or 1825.17",
                    "string.empty": "amount is required",
                }),
        });
    }
    /**
     * Validate user checkout input data.
     * @param {Object} data - The user input data.
     * @returns {Object} - Validation result.
     */
    static checkoutPayment(data) {
        return checkoutValidation.payment().validate(data, { abortEarly: false });
    }
}

module.exports = checkoutValidation;
