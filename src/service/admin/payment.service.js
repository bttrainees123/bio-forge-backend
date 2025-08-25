const paymentModel = require('../../model/payment.model');
const subscriptionModel = require('../../model/subscription.model');
const userModel = require('../../model/user.model');
const stripeHelper = require('../../helper/stripe.helper');
const paymentHelper = require('../../helper/payment.helper');
const { default: mongoose } = require('mongoose');


const paymentService = {};

paymentService.createCheckoutSession = async (request) => {
    const { planType, billingCycle, successUrl, cancelUrl } = request.body;
    const userId = request.auth._id;
    
    const user = await userModel.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
        const customer = await stripeHelper.createCustomer(user.email, user.name, userId);
        stripeCustomerId = customer.id;
        
        await userModel.findByIdAndUpdate(userId, { stripeCustomerId });
    }

    const session = await stripeHelper.createCheckoutSession(
        stripeCustomerId,
        planType,
        billingCycle,
        successUrl,
        cancelUrl,
        userId
    );
    const planConfig = stripeHelper.planConfigs[planType][billingCycle];
    const payment = await paymentModel.create({
        userId,
        stripeSessionId: session.id,
        planType,
        billingCycle,
        amount: planConfig.price,
        paymentStatus: 'pending',
        metadata: {
            sessionUrl: session.url
        }
    });

    return {
        sessionId: session.id,
        sessionUrl: session.url,
        paymentId: payment._id
    };
};

paymentService.verifyPayment = async (request) => {
    const { sessionId } = request.body;
    const userId = request.auth._id;

    const payment = await paymentModel.findOne({ 
        stripeSessionId: sessionId,
        userId 
    });

    if (!payment) {
        throw new Error('Payment not found');
    }

    // Retrieve session from Stripe
    const session = await stripeHelper.retrieveSession(sessionId);
    
    if (session.payment_status === 'paid') {
        payment.paymentStatus = 'succeeded';
        await payment.save();
        
        return {
            status: 'success',
            paymentId: payment._id,
            sessionId
        };
    }

    return {
        status: session.payment_status,
        paymentId: payment._id,
        sessionId
    };
};

paymentService.getUserSubscription = async (request) => {
    const userId = request.auth._id;
    
    const user = await userModel.findById(userId).populate('subscriptionId');
    const activeSubscription = await subscriptionModel.findOne({
        userId,
        subscriptionStatus: 'active',
        is_deleted: '0'
    });

    return {
        currentPlan: user.currentPlan,
        planStatus: user.planStatus,
        subscription: activeSubscription,
        planLimits: paymentHelper.getPlanLimits(user.currentPlan),
        planEndDate: user.planEndDate
    };
};

paymentService.cancelSubscription = async (request) => {
    const { cancelAtPeriodEnd } = request.body;
    const userId = request.auth._id;

    const subscription = await subscriptionModel.findOne({
        userId,
        subscriptionStatus: 'active',
        is_deleted: '0'
    });

    if (!subscription) {
        throw new Error('No active subscription found');
    }

    // Cancel in Stripe
    await stripeHelper.cancelSubscription(subscription.stripeSubscriptionId, cancelAtPeriodEnd);

    // Update local subscription
    subscription.cancelAtPeriodEnd = cancelAtPeriodEnd;
    if (!cancelAtPeriodEnd) {
        subscription.subscriptionStatus = 'canceled';
    }
    await subscription.save();

    return {
        message: cancelAtPeriodEnd ? 
            'Subscription will be canceled at the end of the current period' :
            'Subscription canceled immediately',
        subscription
    };
};

paymentService.getPaymentHistory = async (request) => {
    const userId = request.auth._id;
    const page = Number(request?.query?.page) || 1;
    const limit = Number(request?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    const matchStage = {
        userId: new mongoose.Types.ObjectId(userId),
        is_deleted: '0'
    };

    const data = await paymentModel.aggregate([
        { $match: matchStage },
        {
            $facet: {
                paginatedResults: [
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $project: {
                            planType: 1,
                            billingCycle: 1,
                            amount: 1,
                            currency: 1,
                            paymentStatus: 1,
                            paymentMethod: 1,
                            createdAt: 1
                        }
                    }
                ],
                totalCount: [{ $count: "total" }]
            }
        }
    ]);

    return {
        payments: data[0]?.paginatedResults || [],
        total: data[0]?.totalCount[0]?.total || 0,
        page,
        limit
    };
};

module.exports = paymentService;