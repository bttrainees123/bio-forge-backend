const mongoose = require('mongoose');

const userSubscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    stripeCustomerId: {
        type: String,
        required: true,
        unique: true
    },
    subscriptionId: {
        type: String,
        sparse: true
    },
    plan: {
        type: String,
        enum: ['free', 'pro', 'premium'],
        default: 'free'
    },
    billingCycle: {
        type: String,
        enum: ['monthly', 'annual'],
        default: null
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'canceled', 'past_due', 'unpaid', 'trialing'],
        default: 'inactive'
    },
    currentPeriodStart: {
        type: Date,
        default: null
    },
    currentPeriodEnd: {
        type: Date,
        default: null
    },
    cancelAtPeriodEnd: {
        type: Boolean,
        default: false
    },
    canceledAt: {
        type: Date,
        default: null
    },
    lastPaymentSucceeded: {
        type: Date,
        default: null
    },
    lastPaymentFailed: {
        type: Date,
        default: null
    },
    features: {
        maxSubscribers: {
            type: Number,
            default: 100
        },
        customDomain: {
            type: Boolean,
            default: false
        },
        premiumTemplates: {
            type: Boolean,
            default: false
        },
        advancedAnalytics: {
            type: Boolean,
            default: false
        },
        prioritySupport: {
            type: Boolean,
            default: false
        }
    },
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: new Map()
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

userSubscriptionSchema.virtual('isActive').get(function () {
    if (this.plan === 'free') return true;
    return this.status === 'active' &&
        this.currentPeriodEnd &&
        this.currentPeriodEnd > new Date();
});

userSubscriptionSchema.virtual('isPastDue').get(function () {
    return this.status === 'past_due' ||
        (this.currentPeriodEnd && this.currentPeriodEnd < new Date() && this.status !== 'canceled');
});

userSubscriptionSchema.virtual('daysUntilExpiration').get(function () {
    if (!this.currentPeriodEnd || this.plan === 'free') return null;
    const now = new Date();
    const diffTime = this.currentPeriodEnd.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

userSubscriptionSchema.pre('save', function (next) {
    this.updateFeatures();
    next();
});

userSubscriptionSchema.methods.updateFeatures = function () {
    switch (this.plan) {
        case 'free':
            this.features = {
                maxSubscribers: 100,
                customDomain: false,
                premiumTemplates: false,
                advancedAnalytics: false,
                prioritySupport: false
            };
            break;
        case 'pro':
            this.features = {
                maxSubscribers: 1000,
                customDomain: true,
                premiumTemplates: true,
                advancedAnalytics: true,
                prioritySupport: true
            };
            break;
        case 'premium':
            this.features = {
                maxSubscribers: -1,
                customDomain: true,
                premiumTemplates: true,
                advancedAnalytics: true,
                prioritySupport: true
            };
            break;
    }
};

userSubscriptionSchema.statics.findByEmail = function (email) {
    return this.findOne({ email: email.toLowerCase() });
};

userSubscriptionSchema.statics.findActiveSubscriptions = function () {
    return this.find({
        status: 'active',
        $or: [
            { plan: 'free' },
            { currentPeriodEnd: { $gt: new Date() } }
        ]
    });
};

userSubscriptionSchema.statics.findExpiringSubscriptions = function (days = 7) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.find({
        status: 'active',
        plan: { $ne: 'free' },
        currentPeriodEnd: {
            $gte: new Date(),
            $lte: futureDate
        }
    });
};

userSubscriptionSchema.methods.upgradePlan = function (newPlan, billingCycle) {
    this.plan = newPlan;
    this.billingCycle = billingCycle;
    this.updateFeatures();
    return this.save();
};

userSubscriptionSchema.methods.cancelSubscription = function () {
    this.status = 'canceled';
    this.canceledAt = new Date();
    this.cancelAtPeriodEnd = true;
    return this.save();
};

userSubscriptionSchema.methods.canAccessFeature = function (feature) {
    if (!this.isActive) return false;

    switch (feature) {
        case 'customDomain':
            return this.features.customDomain;
        case 'premiumTemplates':
            return this.features.premiumTemplates;
        case 'advancedAnalytics':
            return this.features.advancedAnalytics;
        case 'prioritySupport':
            return this.features.prioritySupport;
        default:
            return true;
    }
};

userSubscriptionSchema.methods.checkSubscriberLimit = function (currentCount) {
    if (this.features.maxSubscribers === -1) return true;
    return currentCount < this.features.maxSubscribers;
};

// Indexes for performance
// userSubscriptionSchema.index({ email: 1 }, { unique: true });
// userSubscriptionSchema.index({ stripeCustomerId: 1 }, { unique: true });
// userSubscriptionSchema.index({ subscriptionId: 1 }, { sparse: true });
userSubscriptionSchema.index({ status: 1 });
userSubscriptionSchema.index({ currentPeriodEnd: 1 });
userSubscriptionSchema.index({ plan: 1 });


module.exports = userSubscriptionSchema;