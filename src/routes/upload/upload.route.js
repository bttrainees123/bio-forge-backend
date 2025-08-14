const express = require('express');
const uploadRouter = express.Router();
const uploadController=require("../../controller/upload/imageupload.controller")
uploadRouter.post("/singleImage",uploadController.singleImage)
uploadRouter.post("/multiImage",uploadController.mulitpleImage)
module.exports=uploadRouter