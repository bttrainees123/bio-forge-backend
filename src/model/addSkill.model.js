const mongoose = require('mongoose');
const addSkillSchema = require("../schema/addSkill.schema");
const addSkillModel = mongoose.model('addSkills',addSkillSchema);
module.exports = addSkillModel;