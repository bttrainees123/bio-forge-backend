const express = require('express');


const adminController = require("../../controller/admin/auth.controller");
const userController = require("../../controller/admin/user.controller");
const adminMiddleWare = require("../../middleware/admin.middleware");
const reportController = require('../../controller/app/report.controller');
const themeController = require('../../controller/app/theme.controller');

const adminRouter = express.Router();
//login
adminRouter.post("/login", adminController.login);
//dashboard
adminRouter.post("/addUser", adminMiddleWare, userController.add);
adminRouter.post("/updateUser", adminMiddleWare, userController.update);
adminRouter.delete("/deleteUser", adminMiddleWare, userController.delete);
adminRouter.get("/getUser", adminMiddleWare, userController.getAll);
adminRouter.get("/userStatusUpdate", adminMiddleWare, userController.status);
adminRouter.get("/themeStatus", adminMiddleWare, userController.themeStatus);

//change user template status 
adminRouter.post("/changeTemplateStatus", adminMiddleWare, userController.templateStatus);
//dasbhoard
adminRouter.get("/dashboard", adminMiddleWare, userController.dashboard);

// Get all reported users
adminRouter.get('/reports', adminMiddleWare, reportController.getReports);

// Get specific report details by Id
adminRouter.get('/report/:reportId', adminMiddleWare, reportController.getReportDetails);

//add theme
adminRouter.post("/addTheme", adminMiddleWare, themeController.add);
adminRouter.post("/updateTheme", adminMiddleWare, themeController.update);
adminRouter.delete("/deleteTheme", adminMiddleWare, themeController.delete);
adminRouter.get("/getAll-theme", userController.getTemplateList);


module.exports = adminRouter