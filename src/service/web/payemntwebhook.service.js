const Stripe = require('stripe');
const stripeConfig = require('../../config/stripe');
const stripe = Stripe(process.env.sk_test_your_secret_key);
const userModel = require("../../model/user.model");
const { default: mongoose } = require('mongoose');
const payementWebhookService = {};
payementWebhookService.paymentCheckout = async (request) => {
    const amountInCents = Math.round(parseFloat(request.body.amount) * 100);
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: request.body.amount === 99 ? 'Subscriber' : 'Pro Subscriber',
                    },
                    unit_amount: amountInCents,
                },
                quantity: 1,
            },
        ],
        customer_email: request?.auth?.email,
        success_url: stripeConfig.successUrl,
        cancel_url: stripeConfig.cancelUrl,
        metadata: {
            amount: request?.body?.amount.toString(),
            subscription: request.body.amount === 99 ? 'Subscriber' : 'Pro Subscriber',
            userId: request?.auth?._id.toString(),
            email: request?.auth?.email.toString(),
        },
        payment_intent_data: {
            metadata: {
                amount: request?.body?.amount.toString(),
                subscription: request.body.amount === 99 ? 'Subscriber' : 'Pro Subscriber',
                userId: request?.auth?._id.toString(),
                email: request?.auth?.email.toString(),
            }
        }
    });

    return session;
};

payementWebhookService.stripeWebhook = async (request) => {
    const event = request.body;
    switch (event.type) {
        case 'checkout.session.completed': {
            const session = event.data.object;
            console.log("------------------------------session-------------------------------",session)
            const userId = session?.metadata?.userId;
            const subscription = session?.metadata?.subscription;
            const amount = parseFloat(session?.metadata?.amount);
            if (userId && subscription && !isNaN(amount)) {
                await userModel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(userId) }, { subscription: { subscriptionType: subscription, amount: amount } });
            }
            break;
        }
        case 'payment_intent.payment_failed':
            const paymentError = event.data.object.last_payment_error;
            console.error("Payment failed:", paymentError?.message);
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }
};

module.exports = payementWebhookService;
