const subscribeModel = require('../../model/subscribe.model');
const helper = require('../../helper/helper');
const { default: mongoose } = require('mongoose');
const subscribeService = {}
subscribeService.add = async (request) => {
    const { email } = request.body;
    const userId = request?.query._id;
    const existingSubscription = await subscribeModel.findOne({ email, userId });
    if (existingSubscription) {
        return 'existingSubscription';
    }
    request.body.userId = userId;
    const data = await subscribeModel.create(request.body);
    return data;
};
subscribeService.getAll = async (request) => {
    const search = request?.query?.search || "";
    const page = Number(request?.query?.page) || 1;
    const limit = Number(request?.query?.limit) || 5;
    const skip = (page - 1) * limit;
    const userId = request?.auth?._id;

    const matchStage = {
        is_deleted: '0',
        status: 'active',
        userId: new mongoose.Types.ObjectId(userId),
    };
    if (search) {
        matchStage.email = { $regex: search, $options: 'i' };
    }

    const data = await subscribeModel.aggregate([
        { $match: matchStage },
        {
            $facet: {
                paginatedResults: [
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit },
                    { $project: { email: 1, _id: 0 } }
                ],
                totalCount: [
                    { $count: "total" }
                ]
            }
        }
    ]);
    const response = {
        subscribersEmail: data[0]?.paginatedResults || [],
        totalSubscriber: data[0]?.totalCount[0]?.total || 0
    };

    return response;
};

module.exports = subscribeService
