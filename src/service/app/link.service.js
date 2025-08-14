const linkModel = require('../../model/link.model');
const { default: mongoose } = require("mongoose");
const helper = require('../../helper/helper');
const fs = require('fs');
const path = require('path');
const { type } = require('os');
const addLinksValidation = require('../../validation/app/addlink.validation');
const { time } = require('console');
const userModel = require('../../model/user.model');
const {
    NotFoundError,
    BadRequestError,
    ConflictError,
    ValidationError, ForbiddenError
} = require('../../helper/customeErrors');

const linkService = {}
linkService.reorderIndexes = async (userId) => {
    const links = await linkModel.find({
        userId: userId,
        status: 'active',
        is_deleted: '0'
    }).sort({ is_index: 1 });

    // Update indexes to be sequential (0, 1, 2, 3, ...)
    for (let i = 0; i < links.length; i++) {
        if (links[i].is_index !== i) {
            await linkModel.findByIdAndUpdate(links[i]._id, { is_index: i });
        }
    }
};
linkService.add = async (request) => {
    const userId = request.auth._id;
    const body = request.body;
    body.userId = userId;
    if (body.linkLogo) {
        const processed = await helper.moveFileFromFolder(body.linkLogo, "linkLogo");
        if (!processed) {
            throw new Error("Failed to process uploaded logo.");
        }
        body.linkLogo = processed;
    }
    const count = await linkModel.countDocuments({
        userId: userId,
        status: 'active',
        is_deleted: '0'
    });

    body.is_index = count;

    const created = await linkModel.create(body);
    return created;
};
linkService.update = async (request) => {
    const linkData = await linkModel.findOne({ _id: request?.body?._id });

    const oldImage = linkData.linkLogo || "";
    const newImage = request.body.linkLogo || "";
    const tempUploadPath = path.join("public", "tempUploads", newImage);
    if (newImage && fs.existsSync(tempUploadPath)) {
        await helper.moveFileFromFolder(newImage, "linkLogo");

        if (oldImage && oldImage !== newImage) {
            const oldImagePath = path.join("public", "linkLogo", oldImage);
            if (fs.existsSync(oldImagePath)) {
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error(`Failed to delete old image: ${err.message}`);
                    } else {
                        console.log(`Deleted old image: ${oldImage}`);
                    }
                });
            }
        }
        request.body.linkLogo = newImage;
    }

    const updateData = { ...request.body };
    if (!Object.prototype.hasOwnProperty.call(request.body, "videoId")) {
        await linkModel.updateOne(
            { _id: new mongoose.Types.ObjectId(request?.body?._id) },
            { $unset: { videoId: "" }, $set: updateData }
        );
    } else {
        await linkModel.updateOne(
            { _id: new mongoose.Types.ObjectId(request?.body?._id) },
            { $set: updateData }
        );
    }

    return;
};

linkService.delete = async (request) => {
    const link = await linkModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id) });
    if (link && link.linkLogo) {
        const logoPath = path.join("public", "linkLogo", link.linkLogo);
        if (fs.existsSync(logoPath)) {
            fs.unlink(logoPath, (err) => {
                if (err) {
                    console.error(`Failed to delete linkLogo: ${err.message}`);
                }
            });
        }
    }
    await linkModel.findByIdAndDelete({ _id: new mongoose.Types.ObjectId(request?.query?._id) });
}
linkService.updateStatus = async (request) => {
    const linkUpdate = await linkModel.findOne({ _id: new mongoose.Types.ObjectId(request?.query?._id) });
    if (linkUpdate.status === 'active') {
        await linkModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.query?._id) }, { status: "inactive" })
    }
    else {
        await linkModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(request?.query?._id) }, { status: 'active' })
    }
}
linkService.updateIndex = async (request) => {
    // request.body.is_index = (request.body.is_index);
    for (const item of request.body.items) {
        await linkModel.findByIdAndUpdate({ _id: new mongoose.Types.ObjectId(item?._id) }, { is_index: item.is_index });
    }

};
linkService.get = async (request) => {
    const userId = request?.auth?._id;
    const type = request?.query?.type;

    const TypeCondition = {
        userId: new mongoose.Types.ObjectId(userId),
    };

    if (type && ['social', 'non_social'].includes(type)) {
        TypeCondition.type = type;
    }

    return await linkModel.aggregate([
        {
            $match: TypeCondition
        },

        {
            $unwind: {
                path: "$clicks",
                preserveNullAndEmptyArrays: true
            }
        },

        {
            $lookup: {
                from: 'users',
                let: { clickUserId: "$clicks.userId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$_id", "$$clickUserId"] },
                                    { $eq: ["$is_deleted", "0"] }
                                ]
                            }
                        }
                    },
                    {
                        $project: {
                            username: 1
                        }
                    }
                ],
                as: 'userInfo'
            }
        },

        {
            $addFields: {
                "clicks": {
                    $cond: {
                        if: { $gt: [{ $size: "$userInfo" }, 0] },
                        then: {
                            userInfo: {
                                username: { $arrayElemAt: ["$userInfo.username", 0] },
                                count: "$clicks.count"
                            }
                        },
                        else: {
                            $cond: {
                                if: { $ifNull: ["$clicks.ipAddress", false] },
                                then: {
                                    ipAddress: "$clicks.ipAddress",
                                    count: "$clicks.count"
                                },
                                else: null
                            }
                        }
                    }
                }
            }
        },
        {
            $group: {
                _id: "$_id",
                linkTitle: { $first: "$linkTitle" },
                linkUrl: { $first: "$linkUrl" },
                linkLogo: { $first: "$linkLogo" },
                type: { $first: "$type" },
                status: { $first: "$status" },
                protectedLinks: { $first: "$protectedLinks" },
                videoId: { $first: "$videoId" },
                LinkCategoryId: { $first: "$LinkCategoryId" },
                is_index: { $first: "$is_index" },
                clickCount: { $first: "$clickCount" },
                clicks: {
                    $push: {
                        $cond: {
                            if: { $ne: ["$clicks", null] },
                            then: "$clicks",
                            else: "$$REMOVE"
                        }
                    }
                }
            }
        },
        {
            $project: {
                linkTitle: 1,
                linkUrl: 1,
                linkLogo: 1,
                type: 1,
                status: 1,
                protectedLinks: 1,
                videoId: 1,
                LinkCategoryId:1,
                is_index: 1,
                clickCount: 1,
                clicks: {
                    $cond: {
                        if: { $eq: [{ $size: "$clicks" }, 0] },
                        then: [],
                        else: "$clicks"
                    }
                }
            }
        },
        {
            $sort: {
                updateAt: 1,
                is_index: 1,
            }
        },
    ]);
};
linkService.recordClickService = async ({ linkId, userId, ipAddress }) => {
    const link = await linkModel.findById(linkId);
    if (!link) {
        throw new ForbiddenError('Link not found')
    };
    if (userId && String(userId) === String(link.userId)) {

        return { clickCount: link.clickCount };
    }

    const now = new Date();

    if (userId) {
        const user = await userModel.findById(userId);
        if (!user) {
            throw new ForbiddenError('User not found')
        };

        const click = link.clicks.find(c => String(c.userId) === String(userId));

        if (click) {

            click.count += 1;
            click.lastClickedAt = now;
        } else {

            link.clicks.push({
                userId,
                ipAddress: undefined,
                count: 1,
                lastClickedAt: now
            });
        }
    } else if (ipAddress) {

        const click = link.clicks.find(c => c.ipAddress === ipAddress);

        if (click) {

            click.count += 1;
            click.lastClickedAt = now;
        } else {

            link.clicks.push({
                userId: undefined,
                ipAddress,
                count: 1,
                lastClickedAt: now
            });
        }
    } else {
        throw new ForbiddenError('Neither userId nor ipAddress provided');
    }

    link.clickCount += 1;
    await link.save();

    return { clickCount: link.clickCount };
};


module.exports = linkService;

