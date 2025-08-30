const mongoose = require('mongoose');
const skillNameSchema = require("../schema/addSkill.schema");
const skillNameModel = mongoose.model('skills',skillNameSchema);
module.exports = skillNameModel;