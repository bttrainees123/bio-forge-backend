const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    type: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    bio: {
        type: String
    },
    profile_img: {
        type: String,
        default: "twitter.png"
    },
    banner_img: {
        type: String,
        default: "abstract.jpg"
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    theme: {
        themeType: {
            type: String,
            enum: ["color", "img"]
        },
        fontFamily: {
            type: String,
            default: 'cursive'
        },
        fontColor: {
            type: String,
            default: '#ffffff'
        },
        is_colorImage: {
            type: String,
            default: '#52dab2'
        },
        themeDesign: {
            type: String,
            default: 'retro'
        }
    },
    protectedLinks: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    protectedLinksPassword: {
        type: String,


    },

    is_deleted: {
        type: String,
        enum: ["0", "1"],
        default: "0"
    }, inactiveReason: {
        type: String,
        enum: ['Multiple reports', 'Admin action', 'Violation', 'Other'],
        default: null
    },
    inactivatedAt: {
        type: Date,
        default: null
    },
    reportCount: {
        type: Number,
        default: 0
    },
    reportStatus: {
        type: String,
        default: 'false',
        enum: ['true', 'false']
    },
    themeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'theme'
    },
    currentPlan: {
        type: String,
        enum: ['free', 'pro', 'premium'],
        default: 'free'
    },
    planStatus: {
        type: String,
        enum: ['active', 'inactive', 'canceled', 'past_due'],
        default: 'active'
    },
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subscriptions'
    },
    stripeCustomerId: {
        type: String
    },
    subscriberLimit: {
        type: Number,
        default: 100 // Free plan limit
    },
    planStartDate: {
        type: Date,
        default: Date.now
    },
    planEndDate: {
        type: Date
    },
    isTrialActive: {
        type: Boolean,
        default: false
    },
    trialEndDate: {
        type: Date
    },
    paymentHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'payments'
    }],
},
    {
        timestamps: true,
        toJSON: {
            virtuals: false,
            transform: function (doc, ret) {
                if (ret.links && Array.isArray(ret.links)) {
                    ret.links.forEach(link => {
                        delete link.id;
                    });
                }
                return ret;
            }
        },
        toObject: {
            virtuals: false,
            transform: function (doc, ret) {
                if (ret.links && Array.isArray(ret.links)) {
                    ret.links.forEach(link => {
                        delete link.id;
                    });
                }
                return ret;
            }
        }

    },

);

module.exports = userSchema;

