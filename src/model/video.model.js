const mongoose = require('mongoose');
const videoSchema = require("../schema/video.schema");
const videoModel = mongoose.model('videos',videoSchema);
module.exports = videoModel;