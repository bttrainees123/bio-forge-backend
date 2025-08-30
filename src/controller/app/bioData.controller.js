const bioDataService = require('../../service/app/bioData.service');
const responseHelper = require('../../helper/response');
const statusCodes = require('../../helper/statusCodes');
const { default: mongoose } = require('mongoose');
const bioDataModel = require('../../model/bioData.model');

class bioDataController {
    add = async (request, response) => {
        try {
            // const { error } = await bioDataValidation.validateAddbioData(request.body,);
            // const validationError = responseHelper.validatIonError(response, error);
            // if (validationError) return;
            await bioDataService.add(request);
            return responseHelper.success(response, `bioData added successfully`, null, statusCodes.OK)
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    update = async (request, response) => {
        try {
            // const { error } = await bioDataValidation.validateUpdatebioData(request.body,);
            // const validationError = responseHelper.validatIonError(response, error);
            // if (validationError) return;
            await bioDataService.update(request);
            return responseHelper.success(response, `bioData updated successfully`, null, statusCodes.OK)
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }

    getAll = async (request, response) => {
        try {
            const data = await bioDataService.getAll(request);
            return responseHelper.success(response, `bioData fetched successfully`, data, statusCodes.OK);
        } catch (error) {
            console.error(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };
 
}

module.exports = new bioDataController()