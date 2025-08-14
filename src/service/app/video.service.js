const videoModel = require('../../model/video.model');
const helper = require('../../helper/helper');
const { default: mongoose } = require('mongoose');
const videoService = {}

videoService.add = async (request) => {
    request.body.userId = request.auth._id;
    const data = await videoModel.create(request.body);
    return data
}
videoService.update = async (request) => {
    return await videoModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request.body._id) }, request.body);
}
videoService.delete = async (request) => {
    await videoModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request.query._id) }, { is_deleted: '1' });
}
videoService.getAll = async (request) => {
    const authUserId = request.auth?._id;
    const status = request.query.status;

    const matchStatus = {
        is_deleted: '0',
          userId: new mongoose.Types.ObjectId(authUserId),
    };
    if (status) {
        matchStatus.status = status;
    }

    return await videoModel.aggregate([
        { $match: matchStatus },
        {
            $project: {
                videoTitle: 1,
                videoLink: 1,
                status: 1
            }
        }
    ]);
};


videoService.status = async (request) => {
    const userInfo = await videoModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id) })
    if (userInfo.status === 'active') {
        await videoModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.query?._id) }, { status: "inactive" })
    } else {
        await videoModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.query?._id) }, { status: "active" })
    }
}

module.exports = videoService