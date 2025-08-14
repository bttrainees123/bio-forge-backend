const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    stripeSessionId: {
        type: String,
        required: true
    },
    stripePaymentIntentId: {
        type: String
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
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'inr'
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'upi', 'wallet', 'netbanking'],
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'processing', 'succeeded', 'failed', 'canceled'],
        default: 'pending'
    },
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subscriptions'
    },
    metadata: {
        type: Object,
        default: {}
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

module.exports =  paymentSchema;