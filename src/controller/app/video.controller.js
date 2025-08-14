const videoService = require('../../service/app/video.service');
const responseHelper = require('../../helper/response');
const statusCodes = require('../../helper/statusCodes');
const { default: mongoose } = require('mongoose');
const videoModel = require('../../model/video.model');
const videoValidation = require('../../validation/app/video.validation');

class videoController {
    add = async (request, response) => {
        try {
            // const { error } = await videoValidation.validateAddvideo(request.body,);
            // const validationError = responseHelper.validatIonError(response, error);
            // if (validationError) return;
            const data = await videoService.add(request);
            return responseHelper.success(response, `video added successfully`, null, statusCodes.OK)
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    update = async (request, response) => {
        try {
            // const { error } = await videoValidation.validateUpdatevideo(request.body,);
            // const validationError = responseHelper.validatIonError(response, error);
            // if (validationError) return;
            const data = await videoService.update(request);
            return responseHelper.success(response, `video updated successfully`, null, statusCodes.OK)
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    delete = async (request, response) => {
        try {
            const videoData = await videoModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id), is_deleted: '0' });
            if (!videoData) {
                return responseHelper.Forbidden(response, `video not found`, null, statusCodes.OK)
            }
            const data = await videoService.delete(request);
            return responseHelper.success(response, `video deleted successfully`, null, statusCodes.OK);
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR)
        }
    }
    getAll = async (request, response) => {
        try {
            const data = await videoService.getAll(request);
            return responseHelper.success(response, `video fetched successfully`, data, statusCodes.OK);
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
            const videoInfo = await videoModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id) })
            if (!videoInfo) {
                return responseHelper.Forbidden(response, "video not exists", null, statusCodes.OK);
            } else if (videoInfo.is_deleted === '1') {
                return responseHelper.Forbidden(response, "video account is deleted", null, statusCodes.OK);
            }
            await videoService.status(request)
            return responseHelper.success(response, `video status update successfully`, null, statusCodes.OK);

        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);

        }
    }
}

module.exports = new videoController()