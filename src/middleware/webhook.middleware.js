const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const verifyStripeWebhook = (req, res, next) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        req.stripeEvent = event;
        next();
    } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
};

module.exports = { verifyStripeWebhook };