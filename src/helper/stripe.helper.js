const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const stripeConfig = require('../../src/config/stripe');

const stripeHelper = {
    // Plan configurations matching your frontend
    planConfigs: {
        pro: {
            monthly: { price: 99, priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID },
            annual: { price: 995.17, priceId: process.env.STRIPE_PRO_ANNUAL_PRICE_ID }
        },
        premium: {
            monthly: { price: 399, priceId: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID },
            annual: { price: 1825.17, priceId: process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID }
        }
    },

    createCustomer: async (email, name, userId) => {
        const customer = await stripe.customers.create({
            email,
            name,
            metadata: { userId: userId.toString() }
        });
        return customer;
    },

    createCheckoutSession: async (customerId, planType, billingCycle, successUrl, cancelUrl, userId) => {
        const config = stripeHelper.planConfigs[planType][billingCycle];
        
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            payment_method_options: {
                card: {
                    // Enable UPI and other Indian payment methods
                    request_three_d_secure: 'automatic',
                },
            },
            line_items: [{
                price: config.priceId,
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: stripeConfig.successUrl,
            cancel_url: stripeConfig.cancelUrl,
            metadata: {
                userId: userId.toString(),
                planType,
                billingCycle
            },
            // Enable Indian payment methods
            locale: 'auto',
            billing_address_collection: 'required',
        });
        
        return session;
    },

    createPaymentIntent: async (amount, currency = 'inr', customerId, metadata = {}) => {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to smallest currency unit
            currency,
            customer: customerId,
            metadata,
            // Enable Indian payment methods
            payment_method_types: ['card', 'upi'],
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never'
            }
        });
        return paymentIntent;
    },

    retrieveSubscription: async (subscriptionId) => {
        return await stripe.subscriptions.retrieve(subscriptionId);
    },

    cancelSubscription: async (subscriptionId, cancelAtPeriodEnd = true) => {
        if (cancelAtPeriodEnd) {
            return await stripe.subscriptions.update(subscriptionId, {
                cancel_at_period_end: true
            });
        } else {
            return await stripe.subscriptions.cancel(subscriptionId);
        }
    },

    retrieveSession: async (sessionId) => {
        return await stripe.checkout.sessions.retrieve(sessionId);
    }
};

module.exports = stripeHelper;