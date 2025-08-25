const paymentService = require('../../service/admin/payment.service');
const responseHelper = require('../../helper/response');
const statusCodes = require('../../helper/statusCodes');
const paymentValidation = require('../../validation/admin/payment.validation');

class PaymentController {
    createCheckoutSession = async (request, response) => {
        try {
            const { error } = paymentValidation.validateCreateCheckoutSession(request.body);
            const validationError = responseHelper.validatIonError(response, error);
            if (validationError) return;

            const data = await paymentService.createCheckoutSession(request);
            return responseHelper.success(response, 'Checkout session created successfully', data, statusCodes.OK);
        } catch (error) {
            console.error(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };

    verifyPayment = async (request, response) => {
        try {
            const data = await paymentService.verifyPayment(request);
            return responseHelper.success(response, 'Payment verified successfully', data, statusCodes.OK);
        } catch (error) {
            console.error(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };

    getUserSubscription = async (request, response) => {
        try {
            const data = await paymentService.getUserSubscription(request);
            return responseHelper.success(response, 'Subscription details fetched successfully', data, statusCodes.OK);
        } catch (error) {
            console.error(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };

    cancelSubscription = async (request, response) => {
        try {
            const { error } = paymentValidation.validateCancelSubscription(request.body);
            const validationError = responseHelper.validatIonError(response, error);
            if (validationError) return;

            const data = await paymentService.cancelSubscription(request);
            return responseHelper.success(response, 'Subscription canceled successfully', data, statusCodes.OK);
        } catch (error) {
            console.error(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };

    getPaymentHistory = async (request, response) => {
        try {
            const data = await paymentService.getPaymentHistory(request);
            return responseHelper.success(response, 'Payment history fetched successfully', data, statusCodes.OK);
        } catch (error) {
            console.error(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };
}

module.exports = new PaymentController();