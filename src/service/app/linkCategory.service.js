const linkCategoryModel = require('../../model/linkCategory.model');
const helper = require('../../helper/helper');
const { default: mongoose } = require('mongoose');
const linkCategoryService = {}

linkCategoryService.add = async (request) => {
    request.body.userId = request.auth._id;
     if (request.body.image) {
            await helper.moveFileFromFolder(request.body.image, "linkCategory");
        }
    const data = await linkCategoryModel.create(request.body);
    return data
}
linkCategoryService.update = async (request) => {
    return await linkCategoryModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request.body._id) }, request.body);
}
linkCategoryService.delete = async (request) => {
    await linkCategoryModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request.query._id) }, { is_deleted: '1' });
}
linkCategoryService.getAll = async (request) => {
    const authUserId = request.auth?._id;
    const status = request.query.status;

    const matchStatus = {
        is_deleted: '0',
          userId: new mongoose.Types.ObjectId(authUserId),
    };
    if (status) {
        matchStatus.status = status;
    }

    return await linkCategoryModel.aggregate([
        { $match: matchStatus },
        {
            $project: {
                title: 1,
                image: 1,
                link: 1,
                status: 1
            }
        }
    ]);
};


linkCategoryService.status = async (request) => {
    const userInfo = await linkCategoryModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id) })
    if (userInfo.status === 'active') {
        await linkCategoryModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.query?._id) }, { status: "inactive" })
    } else {
        await linkCategoryModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.query?._id) }, { status: "active" })
    }
}

module.exports = linkCategoryService