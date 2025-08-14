const mongoose = require('mongoose');
const userSubcriptionSchema = require("../schema/userSubscription.schema");
const userSubcriptionModel = mongoose.model('usersubcription',userSubcriptionSchema);
module.exports = userSubcriptionModel;