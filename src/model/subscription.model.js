const mongoose = require('mongoose');
const subscriptionSchema = require("../schema/subscription.schema");
const subscriptionModel = mongoose.model('subscripts',subscriptionSchema);
module.exports = subscriptionModel;