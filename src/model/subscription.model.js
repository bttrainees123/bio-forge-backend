const mongoose = require('mongoose');
const subscriptionSchema = require("../schema/subscription.schema");
const subscriptionModel = mongoose.model('subscription',subscriptionSchema);
module.exports = subscriptionModel;