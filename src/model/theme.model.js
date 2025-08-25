const mongoose = require('mongoose');
const templateSchema = require("../schema/theme.schema");
const templateModel = mongoose.model('theme',templateSchema);
module.exports = templateModel;