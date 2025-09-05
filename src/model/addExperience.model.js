const mongoose = require('mongoose');
const addExperienceSchema = require("../schema/addExperience.schema");
const addExperienceModel = mongoose.model('educationalinformation', addExperienceSchema);
module.exports = addExperienceModel;