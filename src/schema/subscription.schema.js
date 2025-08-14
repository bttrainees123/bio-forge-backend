const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    stripeSubscriptionId: {
        type: String,
        required: true
    },
    planType: {
        type: String,
        enum: ['free', 'pro', 'premium'],
        required: true
    },
    billingCycle: {
        type: String,
        enum: ['monthly', 'annual'],
        required: true
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'inactive', 'canceled', 'past_due', 'unpaid'],
        default: 'active'
    },
    currentPeriodStart: {
        type: Date,
        required: true
    },
    currentPeriodEnd: {
        type: Date,
        required: true
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
        required: true
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