const subscribeService = require('../../service/app/subscribe.service');
const responseHelper = require('../../helper/response');
const statusCodes = require('../../helper/statusCodes');
const { default: mongoose } = require('mongoose');
const subscribeModel = require('../../model/subscribe.model');
const subscribeValidation = require('../../validation/app/subscribe.validation');

class subscribeController {
    add = async (request, response) => {
        try {
            const { error } = await subscribeValidation.validateAddsubscribe(request.body,);
            const validationError = responseHelper.validatIonError(response, error);
            if (validationError) return;
            const data = await subscribeService.add(request);
            if(data === 'existingSubscription'){
                return responseHelper.error(response, `you already subscribed this user`,statusCodes.OK)
            }
            return responseHelper.success(response, `subscribe added successfully`, null, statusCodes.OK)
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
    getAll = async (request, response) => {
        try {
            const data = await subscribeService.getAll(request);
            return responseHelper.success(response, `subscribe fetched successfully`, data, statusCodes.OK);
        } catch (error) {
            console.error(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };
}

module.exports = new subscribeController()