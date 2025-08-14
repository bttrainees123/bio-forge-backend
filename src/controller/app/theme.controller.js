const themeService = require('../../service/app/theme.service');
const { default: mongoose } = require("mongoose");
const statusCodes = require('../../helper/statusCodes');
const responseHelper = require('../../helper/response');
const themeModel = require('../../model/theme.model');
const themeValidation = require('../../validation/app/theme.validation');
class themeController {
    add = async (request, response) => {
        try {
            // const { error } = await themeValidation.validateAddtheme(request.body,);
            // const validationError = responseHelper.validatIonError(response, error);
            // if (validationError) return;
            const data = await themeService.add(request);
            return responseHelper.success(response, `theme added successfully`, null, statusCodes.CREATED);
        } catch (error) {
            console.error(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    update = async (request, response) => {
        try {
            const data = await themeService.update(request);
            return responseHelper.success(response, `theme updated successfully`, data, statusCodes.OK);
        } catch (error) {
            console.error(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    delete = async (request, response) => {
        try {
            const objectId = responseHelper.mongooseObjectIdError(request?.query?._id, response, "_id");
            if (objectId) return;
            const themeInfo = await themeModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id) })
            if (!themeInfo) {
                return responseHelper.Forbidden(response, "theme not exists", null, statusCodes.OK);
            } else if (themeInfo.is_deleted === '1') {
                return responseHelper.Forbidden(response, "theme is Already deleted", null, statusCodes.OK);
            }
            const data = await themeService.delete(request);
            return responseHelper.success(response, `theme deleted successfully`, data, statusCodes.OK);
        } catch (error) {
            console.error(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    getAll = async (request, response) => {
        try {
            // const objectId = responseHelper.mongooseObjectIdError(request?.query?._id, response, "_id");
            // if (objectId) return;
            // const themeInfo = await themeModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id) })
            // if (!themeInfo) {
            //     return responseHelper.Forbidden(response, "theme  not exists", null, statusCodes.OK);
            // } else if (themeInfo.is_deleted === '1') {
            //     return responseHelper.Forbidden(response, "theme  is deleted", null, statusCodes.OK);
            // } else if (themeInfo.status === 'inactive') {
            //     return responseHelper.Forbidden(response, "theme  is Inactive", null, statusCodes.OK);
            // }
            const data = await themeService.getAll(request);
            return responseHelper.success(response, `All themes fetched successfully`, data, statusCodes.OK);
        } catch (error) {
            console.error(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };
}
module.exports = new themeController();

