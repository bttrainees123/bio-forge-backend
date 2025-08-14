const reportService = require('../../service/app/report.service');
const statusCodes = require("../../helper/statusCodes");
const responseHelper = require("../../helper/response");
const reportModel = require('../../model/report.model');
const userModel = require('../../model/user.model');
const { CustomError } = require('../../helper/customeErrors');
const mongoose = require('mongoose');

class reportController {

    add = async (request, response) => {
        try {
            const { reportedUserId, reportedByUserId, message } = request.body;
            const authUserId = String(request.auth._id);
            if (!message || message.trim().length === 0) {
                return responseHelper.BadRequest(response, "Message is required.", null,statusCodes.OK);
            }
            if (reportedUserId && String(reportedUserId) === authUserId) {
                return responseHelper.BadRequest(response, "You cannot report yourself.", null,statusCodes.OK);
            }
            const queryConditions = {
                reportedByUserId : new mongoose.Types.ObjectId(authUserId),
                message: message.trim(),
                is_deleted: { $ne: '1' }
            };
            if (reportedUserId) {
                queryConditions.reportedUserId = new mongoose.Types.ObjectId(reportedUserId);
            } else {
                queryConditions.reportedUserId = null;
            }
            const existingReport = await reportModel.findOne(queryConditions);
            if (existingReport) {
                return responseHelper.BadRequest(response, "You have already reported this user with the same message.", null,statusCodes.OK);
            }
            if (reportedUserId) {
                const targetUser = await userModel.findById(reportedUserId);
                if (!targetUser) {
                    return responseHelper.BadRequest(response, "Reported user does not exist.", null,statusCodes.OK);
                }
                if (targetUser.is_deleted === '1') {
                    return responseHelper.BadRequest(response, "Cannot report a deleted user.", null,statusCodes.OK);
                }
            }
            const result = await reportService.reportUser(request);
            return responseHelper.success(response, `Report submitted successfully`, null, statusCodes.OK);
        } catch (error) {
            console.error(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };

    getReports = async (request, response) => {
        try {
            const result = await reportService.getReports(request);
            return responseHelper.success(response, "Reports fetched successfully", result, statusCodes.OK);
        } catch (error) {
            console.error(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };

    getReportDetails = async (request, response) => {
        try {
            const { reportId } = request.params;
            
            if (!mongoose.Types.ObjectId.isValid(reportId)) {
                return responseHelper.BadRequest(response, "Invalid report ID format.", null);
            }

            const report = await reportModel.findById(reportId)
                .populate('reportedUserId', 'username email status')
                .populate('reportedByUserId', 'username email');
                
            if (!report) {
                return responseHelper.BadRequest(response, "Report not found.", null);
            }

            return responseHelper.success(response, "Report details fetched successfully", report, statusCodes.OK);
        } catch (error) {
            console.error(error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };

    deleteReport = async (request, response) => {
        try {
            const { reportId } = request.params;
            
            if (!mongoose.Types.ObjectId.isValid(reportId)) {
                return responseHelper.BadRequest(response, "Invalid report ID format.", null);
            }

            const result = await reportService.deleteReport(reportId);
            return responseHelper.success(response, result.message, null, statusCodes.OK);
        } catch (error) {
            console.error("Delete Report Error:", error);
            if (error instanceof CustomError) {
                return responseHelper.error(response, error.message, error.statusCode);
            }
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };

    blockUser = async (request, response) => {
        try {
            const { userId } = request.body;
            
            if (!userId) {
                return responseHelper.BadRequest(response, "User ID is required.", null);
            }

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return responseHelper.BadRequest(response, "Invalid user ID format.", null);
            }

            const result = await reportService.blockUser(userId);
            return responseHelper.success(response, result.message, null, statusCodes.OK);
        } catch (error) {
            console.error("Block User Error:", error);
            if (error instanceof CustomError) {
                return responseHelper.error(response, error.message, error.statusCode);
            }
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };

    unblockUser = async (request, response) => {
        try {
            const { userId } = request.body;
            
            if (!userId) {
                return responseHelper.BadRequest(response, "User ID is required.", null);
            }

            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return responseHelper.BadRequest(response, "Invalid user ID format.", null);
            }

            const result = await reportService.unblockUser(userId);
            return responseHelper.success(response, result.message, null, statusCodes.OK);
        } catch (error) {
            console.error("Unblock User Error:", error);
            if (error instanceof CustomError) {
                return responseHelper.error(response, error.message, error.statusCode);
            }
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };

    getMyReports = async (request, response) => {
        try {
            const userId = request.auth._id;
            const { page = 1, limit = 10 } = request.query;
            const skip = (page - 1) * limit;

            const reports = await reportModel.find({
                reportedByUserId: userId,
                is_deleted: { $ne: '1' }
            })
            .populate('reportedUserId', 'username email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

            const total = await reportModel.countDocuments({
                reportedByUserId: userId,
                is_deleted: { $ne: '1' }
            });

            const result = {
                reports,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalReports: total,
                    hasNextPage: page < Math.ceil(total / limit),
                    hasPrevPage: page > 1
                }
            };

            return responseHelper.success(response, "Your reports fetched successfully", result, statusCodes.OK);
        } catch (error) {
            console.error("Get My Reports Error:", error);
            return responseHelper.error(response, error.message, statusCodes.INTERNAL_SERVER_ERROR);
        }
    };
}

module.exports = new reportController();
