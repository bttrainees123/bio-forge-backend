const mongoose = require('mongoose');
const linkCategorySchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    title: {
        type: String,
    },
    image: {
        type: String,
    },
    link: {
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

module.exports = linkCategorySchema
