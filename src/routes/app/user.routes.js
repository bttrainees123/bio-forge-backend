const express = require('express');
const userRouter = express.Router();
const authController = require("../../controller/app/auth.controller");
const linksController = require("../../controller/app/link.controller");
const middleWare = require("../../middleware/user.middleware");
const reportController = require('../../controller/app/report.controller');
const themeController = require('../../controller/app/theme.controller');
const videoController = require('../../controller/app/video.controller');
const subscribeController = require('../../controller/app/subscribe.controller');
const linkCategoryController = require('../../controller/app/linkCategory.controller');
const addExperienceController = require('../../controller/app/addExperience.controller');
const bioDataController = require('../../controller/app/bioData.controller');

userRouter.post("/register", authController.register);
userRouter.post("/login", authController.login);
userRouter.post("/sendOtp", authController.sendOtp);
userRouter.post("/verifyOtp", authController.verifyOpt);
userRouter.post("/changePassword", middleWare, authController.changePassword);
userRouter.post("/accountDelete", middleWare, authController.accountDelete);
userRouter.post("/forgetPassword", authController.forgetPassword);
userRouter.post("/updateProfile", middleWare, authController.updateProfile);
userRouter.get("/getUserInfo", authController.getUserInfo);
userRouter.get("/getUserInfotoken", middleWare, authController.getUserTokenInfo);
// userRouter.get("/getUserInfotoken",middleWare,authController.getUserTokenInfo);
userRouter.get("/getAllUser", authController.getAllUser);
userRouter.post('/logout', authController.logout);
userRouter.get('/getTemplate', middleWare, authController.getTemplate);

//links
userRouter.post('/add-links', middleWare, linksController.add);
userRouter.post("/link-update", middleWare, linksController.update);
userRouter.get("/link-updateStatus", middleWare, linksController.updateStatus);
userRouter.post("/update-index", middleWare, linksController.updateIndex);
userRouter.post("/link-delete", middleWare, linksController.delete);
userRouter.get("/get-links", middleWare, linksController.getAll);

//links record click
userRouter.post('/link/click/:linkId', linksController.recordClick);

//report user
userRouter.post('/report', middleWare, reportController.add);

//template 
userRouter.post('/add-theme', middleWare, themeController.add);
userRouter.post('/update-theme', middleWare, themeController.update);
userRouter.delete('/delete-theme', middleWare, themeController.delete);
userRouter.get('/getAll-theme', themeController.getAll);

//video
userRouter.post('/add-video', middleWare, videoController.add);
userRouter.post('/update-video', middleWare, videoController.update);
userRouter.delete('/delete-video', middleWare, videoController.delete);
userRouter.get('/getAll-video', middleWare, videoController.getAll);
userRouter.get('/status-video', middleWare, videoController.status);

//linkCategory
userRouter.post('/add-linkCategory', middleWare, linkCategoryController.add);
userRouter.post('/update-linkCategory', middleWare, linkCategoryController.update);
userRouter.delete('/delete-linkCategory', middleWare, linkCategoryController.delete);
userRouter.get('/getAll-linkCategory', middleWare, linkCategoryController.getAll);
userRouter.get('/status-linkCategory', middleWare, linkCategoryController.status);
//subscribe
userRouter.post('/add-subscribe', subscribeController.add);
userRouter.get('/getAll-subscribe', middleWare, subscribeController.getAll);
//addExperience
userRouter.post('/addExperience', middleWare, addExperienceController.add);
userRouter.post('/updateExperience', middleWare, addExperienceController.update);
userRouter.delete('/deleteExperience', middleWare, addExperienceController.delete);
userRouter.get('/status-Experience', middleWare, addExperienceController.updateStatus);
userRouter.get('/getAll-Experience', middleWare, addExperienceController.getAll);
userRouter.get('/getUserInfo-Experience', middleWare, addExperienceController.getUserInfo);

//add-bio-data
userRouter.post('/add-bio-data', middleWare, bioDataController.add);
userRouter.post('/update-bio-data', middleWare, bioDataController.update);
// userRouter.delete('/deleteExperience',middleWare,bioDataController.delete);
// userRouter.get('/status-Experience',middleWare,bioDataController.updateStatus);
userRouter.get('/getAll-bio-data', bioDataController.getAll);

module.exports = userRouter