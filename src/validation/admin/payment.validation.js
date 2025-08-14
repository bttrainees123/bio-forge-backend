const Joi = require('joi');

const paymentValidation = {
    validateCreateCheckoutSession: (data) => {
        const schema = Joi.object({
            planType: Joi.string().valid('pro', 'premium').required(),
            billingCycle: Joi.string().valid('monthly', 'annual').required(),
            successUrl: Joi.string().uri().required(),
            cancelUrl: Joi.string().uri().required()
        });
        return schema.validate(data);
    },

    validateWebhook: (data) => {
        const schema = Joi.object({
            type: Joi.string().required(),
            data: Joi.object().required()
        });
        return schema.validate(data);
    },

    validateCancelSubscription: (data) => {
        const schema = Joi.object({
            cancelAtPeriodEnd: Joi.boolean().default(true)
        });
        return schema.validate(data);
    }
};

module.exports = paymentValidation;