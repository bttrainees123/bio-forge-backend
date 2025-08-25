const mongoose = require('mongoose');
const reportSchema = new mongoose.Schema({
   
    reportedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    reportedByUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, {
    timestamps: true
});

module.exports = reportSchema
