const mongoose = require('mongoose');
const addExperienceSchema = require("../schema/addExperience.schema");
const addExperienceModel = mongoose.model('addExperiences',addExperienceSchema);
module.exports = addExperienceModel;