const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paymentModel = require('../model/payment.model');
const subscriptionModel = require('../model/subscription.model');
const userModel = require('../model/user.model');
const paymentHelper = require('../helper/payment.helper');

const handleStripeWebhook = async (request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutSessionCompleted(event.data.object);
                break;
            
            case 'invoice.payment_succeeded':
                await handleInvoicePaymentSucceeded(event.data.object);
                break;
            
            case 'invoice.payment_failed':
                await handleInvoicePaymentFailed(event.data.object);
                break;
            
            case 'customer.subscription.created':
                await handleSubscriptionCreated(event.data.object);
                break;
            
            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object);
                break;
            
            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object);
                break;
            
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
    } catch (error) {
        console.error('Error processing webhook:', error);
        return response.status(500).send('Webhook processing failed');
    }

    response.json({ received: true });
};

const handleCheckoutSessionCompleted = async (session) => {
    const userId = session.metadata.userId;
    const planType = session.metadata.planType;
    const billingCycle = session.metadata.billingCycle;

    // Update payment record
    await paymentModel.findOneAndUpdate(
        { stripeSessionId: session.id },
        { 
            paymentStatus: 'succeeded',
            stripePaymentIntentId: session.payment_intent
        }
    );

    console.log(`Checkout session completed for user ${userId}, plan: ${planType}`);
};

const handleSubscriptionCreated = async (subscription) => {
    const userId = subscription.metadata.userId;
    const customerId = subscription.customer;

    // Get user
    const user = await userModel.findOne({ stripeCustomerId: customerId });
    if (!user) {
        console.error('User not found for subscription creation');
        return;
    }

    // Get plan details from subscription
    const priceId = subscription.items.data[0].price.id;
    const planType = getPlanTypeFromPriceId(priceId);
    const billingCycle = subscription.items.data[0].price.recurring.interval === 'year' ? 'annual' : 'monthly';

    // Create subscription record
    const newSubscription = await subscriptionModel.create({
        userId: user._id,
        stripeSubscriptionId: subscription.id,
        planType,
        billingCycle,
        subscriptionStatus: 'active',
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        amount: subscription.items.data[0].price.unit_amount / 100,
        currency: subscription.currency
    });

    // Update user with subscription details
    const planLimits = paymentHelper.getPlanLimits(planType);
    await userModel.findByIdAndUpdate(user._id, {
        currentPlan: planType,
        planStatus: 'active',
        subscriptionId: newSubscription._id,
        subscriberLimit: planLimits.subscriberLimit === -1 ? 999999 : planLimits.subscriberLimit,
        planStartDate: new Date(subscription.current_period_start * 1000),
        planEndDate: new Date(subscription.current_period_end * 1000),
        $push: { paymentHistory: newSubscription._id }
    });

    console.log(`Subscription created for user ${user._id}, plan: ${planType}`);
};

const handleSubscriptionUpdated = async (subscription) => {
    // Update subscription record
    await subscriptionModel.findOneAndUpdate(
        { stripeSubscriptionId: subscription.id },
        {
            subscriptionStatus: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end
        }
    );

    // Update user plan status
    const localSubscription = await subscriptionModel.findOne({ stripeSubscriptionId: subscription.id });
    if (localSubscription) {
        await userModel.findByIdAndUpdate(localSubscription.userId, {
            planStatus: subscription.status,
            planEndDate: new Date(subscription.current_period_end * 1000)
        });
    }

    console.log(`Subscription updated: ${subscription.id}, status: ${subscription.status}`);
};

const handleSubscriptionDeleted = async (subscription) => {
    // Update subscription record
    await subscriptionModel.findOneAndUpdate(
        { stripeSubscriptionId: subscription.id },
        { subscriptionStatus: 'canceled' }
    );

    // Downgrade user to free plan
    const localSubscription = await subscriptionModel.findOne({ stripeSubscriptionId: subscription.id });
    if (localSubscription) {
        const freePlanLimits = paymentHelper.getPlanLimits('free');
        await userModel.findByIdAndUpdate(localSubscription.userId, {
            currentPlan: 'free',
            planStatus: 'active',
            subscriberLimit: freePlanLimits.subscriberLimit,
            subscriptionId: null
        });
    }

    console.log(`Subscription deleted: ${subscription.id}`);
};

const handleInvoicePaymentSucceeded = async (invoice) => {
    console.log(`Invoice payment succeeded: ${invoice.id}`);
    // Handle successful recurring payment
};

const handleInvoicePaymentFailed = async (invoice) => {
    console.log(`Invoice payment failed: ${invoice.id}`);
    // Handle failed payment - maybe send email notification
};

// Helper function to determine plan type from price ID
const getPlanTypeFromPriceId = (priceId) => {
    const priceMapping = {
        [process.env.STRIPE_PRO_MONTHLY_PRICE_ID]: 'pro',
        [process.env.STRIPE_PRO_ANNUAL_PRICE_ID]: 'pro',
        [process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID]: 'premium',
        [process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID]: 'premium'
    };
    return priceMapping[priceId] || 'free';
};

module.exports = { handleStripeWebhook };