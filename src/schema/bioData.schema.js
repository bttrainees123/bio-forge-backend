const mongoose = require('mongoose');
const bioDataSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    profileImage: {
        type: String,
    },
    backgroundImage: {
        type: String,
    },
    addExperience: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'addexperiences',
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

module.exports = bioDataSchema
