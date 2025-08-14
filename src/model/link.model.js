const mongoose = require('mongoose');
const linkSchema = require("../schema/link.schema");
const linkModel = mongoose.model('links',linkSchema);
module.exports = linkModel;