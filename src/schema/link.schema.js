const mongoose = require('mongoose');
const linkSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    linkTitle: {
        type: String,

    },
    linkUrl: {
        type: String,

    },
    linkLogo: {
        type: String,

    },
    videoId:{
         type: mongoose.Schema.Types.ObjectId,
        ref: "videos"
    },
    LinkCategoryId:[{
         type: mongoose.Schema.Types.ObjectId,
        ref: "linkcategory"
    }],
    type: {
        type: String,
        enum: ['social', 'non_social'],
        default: 'social'
    },
    is_index: {
        type: Number,
        default: 0
    },
    is_deleted: {
        type: String,
        enum: ["0", "1"],
        default: "0"
    },

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },
    clicks: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
            ipAddress: { type: String, },
            count: { type: Number, default: 1 },
            lastClickedAt: { type: Date, default: Date.now }
        }
    ],
    clickCount: {
        type: Number,
        default: 0
    },
    protectedLinks: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },

}, {
    timestamps: true,
});
module.exports = linkSchema
