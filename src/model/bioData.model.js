const mongoose = require('mongoose');
const bioDataSchema = require("../schema/bioData.schema");
const bioDataModel = mongoose.model('biodatas',bioDataSchema);
module.exports = bioDataModel;