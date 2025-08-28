// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paymentModel = require('../model/payment.model');
const subscriptionModel = require('../model/subscription.model');
const userModel = require('../model/user.model');
const paymentHelper = require('../helper/payment.helper');

const handleStripeWebhook = async (request, response) => {
    const sig = request.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        console.log('Webhook event received:', event.type, 'ID:', event.id);
    } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        console.log('Processing event type:', event.type);
        
        switch (event.type) {
            case 'checkout.session.completed':
                console.log('Executing handleCheckoutSessionCompleted');
                await handleCheckoutSessionCompleted(event.data.object);
                break;
            
            case 'invoice.payment_succeeded':
                console.log('Executing handleInvoicePaymentSucceeded');
                await handleInvoicePaymentSucceeded(event.data.object);
                break;
            
            case 'invoice.payment_failed':
                console.log('Executing handleInvoicePaymentFailed');
                await handleInvoicePaymentFailed(event.data.object);
                break;
            
            case 'customer.subscription.created':
                console.log('Executing handleSubscriptionCreated');
                await handleSubscriptionCreated(event.data.object);
                break;
            
            case 'customer.subscription.updated':
                console.log('Executing handleSubscriptionUpdated');
                await handleSubscriptionUpdated(event.data.object);
                break;
            
            case 'customer.subscription.deleted':
                console.log('Executing handleSubscriptionDeleted');
                await handleSubscriptionDeleted(event.data.object);
                break;
            
            default:
                console.log(`Unhandled event type ${event.type}`);
        }
        
        console.log('Event processing completed successfully');
    } catch (error) {
        console.error('Error processing webhook:', error);
        console.error('Event type:', event.type);
        console.error('Event data:', JSON.stringify(event.data.object, null, 2));
        return response.status(500).send('Webhook processing failed');
    }

    response.json({ received: true });
};

const handleCheckoutSessionCompleted = async (session) => {
    console.log('Checkout session completed:', JSON.stringify(session, null, 2));
    
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

    // If this is a subscription checkout, handle subscription creation here as backup
    if (session.mode === 'subscription' && session.subscription) {
        console.log('Checkout session is for subscription:', session.subscription);
        
        try {
            // Retrieve the full subscription object
            const subscription = await stripe.subscriptions.retrieve(session.subscription);
            console.log('Retrieved subscription:', JSON.stringify(subscription, null, 2));
            
            // Check if we've already processed this subscription
            const existingSubscription = await subscriptionModel.findOne({ 
                stripeSubscriptionId: subscription.id 
            });
            
            if (!existingSubscription) {
                console.log('Subscription not found in DB, creating from checkout session');
                // Call our subscription handler manually
                await handleSubscriptionCreated(subscription);
            } else {
                console.log('Subscription already exists in DB');
            }
        } catch (error) {
            console.error('Error handling subscription from checkout:', error);
        }
    }

    console.log(`Checkout session completed for user ${userId}, plan: ${planType}`);
};

const handleSubscriptionCreated = async (subscription) => {
    console.log('handleSubscriptionCreated called with:', JSON.stringify(subscription, null, 2));
    
    let userId = subscription.metadata?.userId;
    const customerId = subscription.customer;

    const user = await userModel.findOne({ stripeCustomerId: customerId });
    if (!user) {
        console.error('User not found for subscription creation. Customer ID:', customerId);
        return;
    }

    if (!userId) {
        userId = user._id.toString();
        console.log('Retrieved userId from database:', userId);
    }

    const priceId = subscription.items.data[0].price.id;
    const planType = getPlanTypeFromPriceId(priceId);
    const billingCycle = subscription.items.data[0].price.recurring.interval === 'year' ? 'annual' : 'monthly';

    console.log('Creating subscription with:', {
        userId: user._id,
        planType,
        billingCycle,
        subscriptionId: subscription.id
    });

    const existingSubscription = await subscriptionModel.findOne({ 
        stripeSubscriptionId: subscription.id 
    });
    
    if (existingSubscription) {
        console.log('Subscription already exists:', subscription.id);
        return;
    }

    const newSubscription = await subscriptionModel.create({
        userId: user._id,
        stripeSubscriptionId: subscription.id,
        planType,
        billingCycle,
        subscriptionStatus: subscription.status, 
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        amount: subscription.items.data[0].price.unit_amount / 100,
        currency: subscription.currency
    });

    const planLimits = paymentHelper.getPlanLimits(planType);
    await userModel.findByIdAndUpdate(user._id, {
        currentPlan: planType,
        planStatus: subscription.status, 
        subscriptionId: newSubscription._id,
        subscriberLimit: planLimits.subscriberLimit === -1 ? 999999 : planLimits.subscriberLimit,
        planStartDate: new Date(subscription.current_period_start * 1000),
        planEndDate: new Date(subscription.current_period_end * 1000),
        $push: { paymentHistory: newSubscription._id }
    });

    console.log(`Subscription created successfully for user ${user._id}, plan: ${planType}`);
};

const handleSubscriptionUpdated = async (subscription) => {
  
    await subscriptionModel.findOneAndUpdate(
        { stripeSubscriptionId: subscription.id },
        {
            subscriptionStatus: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end
        }
    );

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
    await subscriptionModel.findOneAndUpdate(
        { stripeSubscriptionId: subscription.id },
        { subscriptionStatus: 'canceled' }
    );

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
    console.log('Invoice details:', JSON.stringify(invoice, null, 2));

    if (invoice.subscription && invoice.billing_reason === 'subscription_create') {
        try {
           
            const existingSubscription = await subscriptionModel.findOne({ 
                stripeSubscriptionId: invoice.subscription 
            });
            
            if (!existingSubscription) {
                console.log('First invoice for new subscription, retrieving subscription details');
                
                const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
                
              
                await handleSubscriptionCreated(subscription);
            } else {
                console.log('Subscription already exists in DB');
            }
        } catch (error) {
            console.error('Error handling subscription from invoice:', error);
        }
    }
};

const handleInvoicePaymentFailed = async (invoice) => {
    console.log(`Invoice payment failed: ${invoice.id}`);
};

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