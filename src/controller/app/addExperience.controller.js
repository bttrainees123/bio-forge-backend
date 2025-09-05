const addExperienceService = require('../../service/app/addExperience.service');
const responseHelper = require('../../helper/response');
const statusCodes = require('../../helper/statusCodes');
const { default: mongoose } = require('mongoose');
const addExperienceModel = require('../../model/addExperience.model');
const addExperienceValidation = require('../../validation/app/addExperience.validation');

class addExperienceController {
    add = async (request, response) => {
        try {
            const { error } = await addExperienceValidation.validateByType(request.body,);
            const validationError = responseHelper.validatIonError(response, error);
            if (validationError) return;
            const data = await addExperienceService.add(request);
            return responseHelper.success(response, `Add Experience added successfully`, data, statusCodes.OK)
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    update = async (request, response) => {
        try {
            const { error } = await addExperienceValidation.validateUpdate(request.body,);
            const validationError = responseHelper.validatIonError(response, error);
            if (validationError) return;
            await addExperienceService.update(request);
            return responseHelper.success(response, `addExperience updated successfully`, null, statusCodes.OK)
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    delete = async (request, response) => {
        try {
            const addExperienceData = await addExperienceModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id), is_deleted: '0' });
            if (!addExperienceData) {
                return responseHelper.Forbidden(response, `addExperience not found`, null, statusCodes.OK)
            }
            await addExperienceService.delete(request);
            return responseHelper.success(response, `addExperience deleted successfully`, null, statusCodes.OK);
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR)
        }
    }
    updateStatus = async (request, response) => {
        try {
            await addExperienceService.updateStatus(request);
            return responseHelper.success(response, `skill status updated successfully`, null, statusCodes.OK)
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    getAll = async (request, response) => {
        try {
            const data = await addExperienceService.getAll(request);
            return responseHelper.success(response, `addExperience fetched successfully`, data, statusCodes.OK);
        } catch (error) {
            console.error(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };
    getUserInfo = async (request, response) => {
        try {
            const data = await addExperienceService.getUserInfo(request);
            return responseHelper.success(response, `addExperience fetched successfully`, data, statusCodes.OK);
        } catch (error) {
            console.error(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };
}

module.exports = new addExperienceController()