const mongoose = require('mongoose');
const subscribeSchema = require("../schema/subscribe.schema");
const subscribeModel = mongoose.model('subscribe',subscribeSchema);
module.exports = subscribeModel;