const mongoose = require('mongoose');
const linkCategorySchema = require("../schema/linkCategory.schema");
const linkCategoryModel = mongoose.model('linkcategory',linkCategorySchema);
module.exports = linkCategoryModel;