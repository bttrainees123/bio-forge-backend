const linkCategoryService = require('../../service/app/linkCategory.service');
const responseHelper = require('../../helper/response');
const statusCodes = require('../../helper/statusCodes');
const { default: mongoose } = require('mongoose');
const linkCategoryModel = require('../../model/linkCategory.model');
const linkCategoryValidation = require('../../validation/app/linkCategory.validation');

class linkCategoryController {
    add = async (request, response) => {
        try {
            // const { error } = await linkCategoryValidation.validateAddlinkCategory(request.body,);
            // const validationError = responseHelper.validatIonError(response, error);
            // if (validationError) return;
            const data = await linkCategoryService.add(request);
            return responseHelper.success(response, `linkCategory added successfully`, null, statusCodes.OK)
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    update = async (request, response) => {
        try {
            // const { error } = await linkCategoryValidation.validateUpdatelinkCategory(request.body,);
            // const validationError = responseHelper.validatIonError(response, error);
            // if (validationError) return;
            const data = await linkCategoryService.update(request);
            return responseHelper.success(response, `linkCategory updated successfully`, null, statusCodes.OK)
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    delete = async (request, response) => {
        try {
            const linkCategoryData = await linkCategoryModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id), is_deleted: '0' });
            if (!linkCategoryData) {
                return responseHelper.Forbidden(response, `linkCategory not found`, null, statusCodes.OK)
            }
            const data = await linkCategoryService.delete(request);
            return responseHelper.success(response, `linkCategory deleted successfully`, null, statusCodes.OK);
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR)
        }
    }
    getAll = async (request, response) => {
        try {
            const data = await linkCategoryService.getAll(request);
            return responseHelper.success(response, `linkCategory fetched successfully`, data, statusCodes.OK);
        } catch (error) {
            console.error(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };
    status = async (request, response) => {
        try {
            const objectId = responseHelper.mongooseObjectIdError(request?.query?._id, response, "_id"
            );
            if (objectId) return;
            const linkCategoryInfo = await linkCategoryModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id) })
            if (!linkCategoryInfo) {
                return responseHelper.Forbidden(response, "linkCategory not exists", null, statusCodes.OK);
            } else if (linkCategoryInfo.is_deleted === '1') {
                return responseHelper.Forbidden(response, "linkCategory account is deleted", null, statusCodes.OK);
            }
            await linkCategoryService.status(request)
            return responseHelper.success(response, `linkCategory status update successfully`, null, statusCodes.OK);

        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);

        }
    }
}

module.exports = new linkCategoryController()