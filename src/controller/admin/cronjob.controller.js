const UserReportCronService = require('../../services/cron/userReportCron.service');
const responseHelper = require('../../helper/response');
const statusCodes = require('../../helper/statusCodes');

class CronJobController {
    
   
    triggerUserReportCron = async (request, response) => {
        try {
            const result = await UserReportCronService.manualTrigger();
            
            return responseHelper.success(
                response,
                'User report cron job executed successfully',
                result,
                statusCodes.OK
            );
        } catch (error) {
            console.error('Error triggering user report cron:', error);
            return responseHelper.error(
                response,
                error.message,
                statusCodes.INTERNAL_SERVER_ERROR
            );
        }
    };

  
    getReportStatistics = async (request, response) => {
        try {
            const stats = await UserReportCronService.getReportStatistics();
            
            return responseHelper.success(
                response,
                'Report statistics fetched successfully',
                stats,
                statusCodes.OK
            );
        } catch (error) {
            console.error('Error getting report statistics:', error);
            return responseHelper.error(
                response,
                error.message,
                statusCodes.INTERNAL_SERVER_ERROR
            );
        }
    };
}

module.exports = new CronJobController();
