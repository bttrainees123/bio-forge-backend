const responseHelper = require("../../helper/response");
const contactService = require("../../service/web/contact.service")
const contactValidation = require("../../validation/web/contact.validation")
const statusCodes=require("../../helper/statusCodes")
class contactController {
    add = async (request, response) => {
        try {
            const { error } = await contactValidation.validateAdd(request.body);
            const validationError = responseHelper.validatIonError(response, error);
            if (validationError) return;
            await contactService.add(request)
            return responseHelper.success(response, "Thanks for contacting us! We'll be in touch soon.", null, statusCodes.OK);
        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}
module.exports = new contactController()