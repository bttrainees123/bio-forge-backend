const mongoose = require('mongoose');
const subscriptionSchema = require("../schema/subscription.schema");
const subscriptionModel = mongoose.model('subscriptions',subscriptionSchema);
module.exports = subscriptionModel;