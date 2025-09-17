const mongoose = require('mongoose');
const themeDesignSchema = require("../schema/themeDesign.schema");
const themeDesignModel = mongoose.model('themedesigns',themeDesignSchema);
module.exports = themeDesignModel;