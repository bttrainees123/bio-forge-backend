const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',

    },
    stripeSubscriptionId: {
        type: String,
       
    },
    planType: {
        type: String,
        enum: ['free', 'pro', 'premium'],
       
    },
    billingCycle: {
        type: String,
        enum: ['monthly', 'annual'],
       
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'inactive', 'canceled', 'past_due', 'unpaid'],
        default: 'active'
    },
    currentPeriodStart: {
        type: Date,
       
    },
    currentPeriodEnd: {
        type: Date,
       
    },
    cancelAtPeriodEnd: {
        type: Boolean,
        default: false
    },
    trialStart: {
        type: Date
    },
    trialEnd: {
        type: Date
    },
    amount: {
        type: Number,
       
    },
    currency: {
        type: String,
        default: 'inr'
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    is_deleted: {
        type: String,
        enum: ['0', '1'],
        default: '0'
    }
}, {
    timestamps: true
});

module.exports = subscriptionSchema;