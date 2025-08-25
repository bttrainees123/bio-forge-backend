const mongoose = require('mongoose');
const videoSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    videoTitle: {
        type: String,
    },
    videoLink: {
        type: String,
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
    },
}, {
    timestamps: true
});

module.exports = videoSchema
