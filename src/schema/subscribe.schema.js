const mongoose = require('mongoose');
const subscribeSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    email: {
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
subscribeSchema.index({ userId: 1, email: 1 }, { unique: true });

module.exports = subscribeSchema
