const mongoose = require('mongoose');
const checkoutSessionSchema = require("../schema/checkoutSession.schema");
const CheckoutSessionModel = mongoose.model('checkoutsession',checkoutSessionSchema);
module.exports = CheckoutSessionModel;