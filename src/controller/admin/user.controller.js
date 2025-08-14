const responseHelper = require("../../helper/response");
const userService = require("../../service/admin/user.service")
const authService = require("../../service/app/auth.service")
const userValidation = require("../../validation/admin/user.validation")
const statusCodes = require("../../helper/statusCodes")
const userModel = require("../../model/user.model");
const { default: mongoose } = require("mongoose");
const themeModel = require("../../model/theme.model");
const templateService = require("../../service/app/theme.service");
class userController {
    add = async (request, response) => {
        try {
            const { error } = await userValidation.validateadd(request.body);
            const validationError = responseHelper.validatIonError(response, error);
            if (validationError) return;
            if (await userModel.findOne({ email: new RegExp(`^${request.body.email}$`, 'i'), is_deleted: "0" })) {
                if (await userModel.findOne({ username: request.body.username, is_deleted: "0" })) {
                    return responseHelper.Forbidden(response, "Username already exists", null, statusCodes.OK);
                }
                return responseHelper.Forbidden(response, "Email already exists", null, statusCodes.OK);
            }
            await userService.add(request)
            return responseHelper.success(response, `User create successfully`, null, statusCodes.OK);

        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    getAll = async (request, response) => {
        try {
            const data = await userService.get(request)
            return responseHelper.success(response, `User List`, data, statusCodes.OK);

        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);

        }
    }
    update = async (request, response) => {
        try {
            const { error } = await userValidation.validateUpdate(request.body);
            const validationError = responseHelper.validatIonError(response, error);
            if (validationError) return;
            const templateInfo = await userModel.findOne({ _id: new mongoose.Types.ObjectId(request?.body?._id) })
            if (!templateInfo) {
                return responseHelper.Forbidden(response, "User not exists", null, statusCodes.OK);
            } else if (templateInfo.is_deleted === '1') {
                return responseHelper.Forbidden(response, "User account is deleted", null, statusCodes.OK);
            }
            if (await userModel.findOne({ _id: { $ne: new mongoose.Types.ObjectId(request?.body?._id) }, username: request.body.username, is_deleted: "0" })) {
                return responseHelper.Forbidden(response, "Username already exists", null, statusCodes.OK);
            }
            if (await userModel.findOne({ _id: { $ne: new mongoose.Types.ObjectId(request?.body?._id) }, email: request.body.email, is_deleted: "0" })) {
                return responseHelper.Forbidden(response, "Email already exists", null, statusCodes.OK);
            }
            await userService.update(request)
            return responseHelper.success(response, `User update successfully`, null, statusCodes.OK);

        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    delete = async (request, response) => {
        try {
            const objectId = responseHelper.mongooseObjectIdError(request?.query?._id, response, "_id"
            );
            if (objectId) return;
            const templateInfo = await userModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id) })
            if (!templateInfo) {
                return responseHelper.Forbidden(response, "User not exists", null, statusCodes.OK);
            } else if (templateInfo.is_deleted === '1') {
                return responseHelper.Forbidden(response, "User account is deleted", null, statusCodes.OK);
            }
            await userService.delete(request)
            return responseHelper.success(response, `User delete successfully`, null, statusCodes.OK);

        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);

        }
    }
    status = async (request, response) => {
        try {
            const objectId = responseHelper.mongooseObjectIdError(request?.query?._id, response, "_id"
            );
            if (objectId) return;
            const templateInfo = await userModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id) })
            if (!templateInfo) {
                return responseHelper.Forbidden(response, "User not exists", null, statusCodes.OK);
            } else if (templateInfo.is_deleted === '1') {
                return responseHelper.Forbidden(response, "User account is deleted", null, statusCodes.OK);
            }
            await userService.status(request)
            return responseHelper.success(response, `User status update successfully`, null, statusCodes.OK);

        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);

        }
    }
    templateStatus = async (request, response) => {
        try {
            const objectId = responseHelper.mongooseObjectIdError(request?.query?._id, response, "_id"
            );
            if (objectId) return;
            const templateInfo = await themeModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id) })
            if (!templateInfo) {
                return responseHelper.Forbidden(response, "template not exists", null, statusCodes.OK);
            } else if (templateInfo.is_deleted === '1') {
                return responseHelper.Forbidden(response, "template is deleted", null, statusCodes.OK);
            }
            await userService.templateStatus(request)
            return responseHelper.success(response, `template status update successfully`, null, statusCodes.OK);
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }

    }
    dashboard = async (request, response) => {
        try {
            const data = await userService.dashboard(request);
            return responseHelper.success(response, `Dashboard data`, data, statusCodes.OK);
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    getTemplateList = async (request, response) => {
        try {
            const data = await userService.getAll(request);
            return responseHelper.success(response, `Template List`, data, statusCodes.OK);
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    themeStatus = async (request, response) => {
        try {
            const objectId = responseHelper.mongooseObjectIdError(request?.query?._id, response, "_id"
            );
            if (objectId) return;
            const templateInfo = await themeModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id) })
            if (!templateInfo) {
                return responseHelper.Forbidden(response, "theme not exists", null, statusCodes.OK);
            } 
            await userService.themeStatus(request)
            return responseHelper.success(response, `theme status update successfully`, null, statusCodes.OK);

        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);

        }
    }
}
module.exports = new userController()