const mongoose = require('mongoose');
const bioDataSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    profileImage: {
        type: String,
        default: "twitter.png"
    },
    backgroundImage: {
        type: String,
        default: "abstract.jpg"
    },
    bio: {
        type: String
    },
    experienceInfo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'educationalinformations',
    },
    interests: [{
        type: String
    }],
    skills: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'skills'
    }],
    relationship: {
        type: String,
        enum: ['single', 'mingle', 'married',
            'complicated', 'divorced', 'widowed', 'separated'],
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
