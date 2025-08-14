const reportModel = require('../../model/report.model');
const userModel = require('../../model/user.model');
const mongoose = require('mongoose');
const { 
    NotFoundError, 
    BadRequestError, 
    ConflictError,
    ValidationError,ForbiddenError
} = require('../../helper/customeErrors');

const reportService = {};

reportService.reportUser = async (request) => {
    request.body.reportedByUserId = request.auth._id;
    const data = await reportModel.create(request.body);
    return data;
};

reportService.getReports = async (request) => {
    const { page = 1, limit = 10 } = request.query;

    if (page && (isNaN(page) || page < 1)) {
        throw new ValidationError('Page must be a positive number');
    }

    if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
        throw new ValidationError('Limit must be between 1 and 100');
    }

    const skip = (page - 1) * limit;

    const reports = await reportModel.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'reportedUserId',
                foreignField: '_id',
                as: 'reportedUser',
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            email: 1,
                            status: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'reportCount.userId',
                foreignField: '_id',
                as: 'reportingUsers',
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            email: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                totalReports: { $size: '$reportCount' },
                reportedUser: { $arrayElemAt: ['$reportedUser', 0] }
            }
        },
        {
            $sort: { totalReports: -1, createdAt: -1 }
        },
        {
            $skip: skip
        },
        {
            $limit: parseInt(limit)
        }
    ]);

    const total = await reportModel.countDocuments();

    return {
        reports,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalReports: total,
            hasNext: page * limit < total,
            hasPrev: page > 1
        }
    };
};

reportService.deleteReport = async (reportId) => {
    if (!mongoose.Types.ObjectId.isValid(reportId)) {
        throw new ValidationError('Invalid report ID format');
    }

    const report = await reportModel.findById(reportId);
    if (!report) {
        throw new NotFoundError('Report not found');
    }

    await reportModel.findByIdAndDelete(reportId);
    return { message: 'Report deleted successfully' };
};

reportService.blockUser = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ValidationError('Invalid user ID format');
    }

    const user = await userModel.findOne({ _id: userId, is_deleted: '0' });
    if (!user) {
        throw new NotFoundError('User not found');
    }

    if (user.status === 'inactive') {
        throw new ConflictError('User is already blocked');
    }

    await userModel.findByIdAndUpdate(
        userId,
        { status: 'inactive' },
        { new: true }
    );

    return { message: 'User blocked successfully' };
};

reportService.unblockUser = async (userId) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ValidationError('Invalid user ID format');
    }

    const user = await userModel.findOne({ _id: userId, is_deleted: '0' });
    if (!user) {
        throw new NotFoundError('User not found');
    }

    if (user.status === 'active') {
        throw new ConflictError('User is already active');
    }

    await userModel.findByIdAndUpdate(
        userId,
        { status: 'active' },
        { new: true }
    );

    return { message: 'User unblocked successfully' };
};

module.exports = reportService;
