const responseHelper = require("../../helper/response");
const statusCodes = require("../../helper/statusCodes");

const subscriptionService = require("../../service/app/subscription.service");
class subScriptionController {
    getUserInfo = async (request, response) => {
        try {
            const data = await subscriptionService.getInfo(request);
            return responseHelper.success(response, data.message, data.data, statusCodes.OK);

        } catch (error) {
            console.log(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    }
}

module.exports = new subScriptionController();
