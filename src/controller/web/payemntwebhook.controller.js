
const responseHelper = require("../../helper/response");
const payementWebhookService = require("../../service/web/payemntwebhook.service")
const checkoutValidation = require("../../validation/web/checkout.validation");
const statusCodes=require("../../helper/statusCodes")
class PaymentWebhookController {
    paymentCheckout = async (request, response) => {
        try {
            const { error } = checkoutValidation.checkoutPayment(request.body);
            const validationError = responseHelper.validatIonError(response, error);
            if (validationError) return;
            const session = await payementWebhookService.paymentCheckout(request);
            return responseHelper.success(response, `Payment session created`, session.url, statusCodes.OK);
        } catch (error) {
            console.error(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };
    stripeWebhook = async (request, response) => {
        try {
            await payementWebhookService.stripeWebhook(request)
            response.json({ received: true });
        } catch (error) {
            console.error(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}
module.exports = new PaymentWebhookController();
