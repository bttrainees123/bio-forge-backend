const responseHelper = require("../../helper/response");
const statusCodes = require("../../helper/statusCodes")
const helper = require("../../helper/helper")
const adminValidation = require("../../validation/admin/auth.validation")
const authService = require("../../service/admin/auth.service")
const userModel = require("../../model/user.model")
class adminController {
    login = async (request, response) => {
        try {
            const { error } = await adminValidation.validateLogin(request.body);
            const validationError = responseHelper.validatIonError(response, error);
            if (validationError) return;
            const userData = await userModel.findOne({ email: new RegExp(`^${request.body.email}$`, 'i'), type: "admin" });
            if (!userData) {
                return responseHelper.Forbidden(response, "Email not exists", null, statusCodes.OK);
            }
            if (!await helper.comparePassword(request?.body?.password, userData?.password)) {
                return responseHelper.BadRequest(response, `Password is wrong`, null, statusCodes.OK);
            }
            const data = await authService.login(userData)
            return responseHelper.success(response, `${data.username} is login successfully`, data, statusCodes.OK);

        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }

}
module.exports = new adminController()