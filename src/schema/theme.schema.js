const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
    themeName: {
        type: String,
    },
    themeImg: {
        type: String,
    },
    themeDiscription: {
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
    
},{timestamps: true});
module.exports = themeSchema;