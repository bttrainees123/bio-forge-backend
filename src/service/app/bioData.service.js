const bioDataModel = require('../../model/bioData.model');
const helper = require('../../helper/helper');
const { default: mongoose } = require('mongoose');
const fs = require('fs');
const path = require('path');
const bioDataService = {}
bioDataService.add = async (request) => {
    request.body.userId = request.auth._id;
    if (request.body.profileImage) {
        await helper.moveFileFromFolder(request.body.profileImage, "bioDataProfile");
    }
    if (request.body.backgroundImage) {
        await helper.moveFileFromFolder(request.body.backgroundImage, "bioDataBackground");
    }

    const data = await bioDataModel.create(request.body);
    return data;
};
bioDataService.update = async (request) => {
    const userData = await bioDataModel.findOne({ _id: request?.body?._id });
    const oldProfileImg = userData.profileImage || "";
    const newProfileImg = request.body.profileImage || "";
    const oldBannerImg = userData.backgroundImage || "";
    const newBannerImg = request.body.backgroundImage || "";
    if (newProfileImg) {
        const tempProfilePath = path.join("public", "tempUploads", newProfileImg);
        if (fs.existsSync(tempProfilePath)) {
            await helper.moveFileFromFolder(newProfileImg, "bioDataProfile");
            if (oldProfileImg && oldProfileImg !== newProfileImg) {
                const oldProfilePath = path.join("public", "bioDataProfile", oldProfileImg);
                if (fs.existsSync(oldProfilePath)) {
                    fs.unlink(oldProfilePath, (err) => {
                        if (err) {
                            console.error(`Failed to delete old bioDataProfile image: ${err.message}`);
                        } else {
                            console.log(`Deleted old bioDataProfile image: ${oldProfileImg}`);
                        }
                    });
                }
            }
            request.body.profileImage = newProfileImg;
        }
    }
    if (newBannerImg) {
        const tempBannerPath = path.join("public", "tempUploads", newBannerImg);
        if (fs.existsSync(tempBannerPath)) {
            await helper.moveFileFromFolder(newBannerImg, "bioDataBackground");
            if (oldBannerImg && oldBannerImg !== newBannerImg) {
                const oldBannerPath = path.join("public", "bioDataBackground", oldBannerImg);
                if (fs.existsSync(oldBannerPath)) {
                    fs.unlink(oldBannerPath, (err) => {
                        if (err) {
                            console.error(`Failed to delete old banner image: ${err.message}`);
                        } else {
                            console.log(`Deleted old banner image: ${oldBannerImg}`);
                        }
                    });
                }
            }
            request.body.backgroundImage = newBannerImg;
        }
    }

    const updateData = { ...request.body };
    if (!Object.prototype.hasOwnProperty.call(request.body, "skills")) {
        await bioDataModel.updateOne(
            { _id: new mongoose.Types.ObjectId(request?.body?._id) },
            { $unset: { skills: "" }, $set: updateData }
        );
    } 
    
    else {
        await bioDataModel.updateOne(
            { _id: new mongoose.Types.ObjectId(request?.body?._id) },
            { $set: updateData }
        );
    }
    return;
}
bioDataService.getAll = async (request) => {
    const userId = request?.auth?._id || request?.query?.userId;
    const matchCondition = {
        userId: new mongoose.Types.ObjectId(userId),
        is_deleted: '0',
        status: 'active'
    };

    return await bioDataModel.aggregate([
        {
            $match: matchCondition
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                pipeline: [
                    {
                        $match: {
                            is_deleted: '0'
                        }
                    },
                    {
                        $project: {
                            username: 1,
                            email: 1
                        }
                    }
                ],
                as: 'userInfo'
            }
        },

        {
            $lookup: {
                from: 'educationalinformations',
                localField: 'userId',
                foreignField: 'userId',
                pipeline: [
                    {
                        $match: {
                            is_deleted: '0',
                            status: 'active',
                            type: 'experience'
                        }
                    },
                    {
                        $project: {
                            title: 1,
                            employementType: 1,
                            organization: 1,
                            currentlyWorking: 1,
                            startDate: 1,
                            type: 1,
                            endDate: 1,
                            latLong: 1,
                            description: 1,
                            profileHeadline: 1,
                            media: 1,
                            bio_data: 1,
                            work: 1,
                            currentCity: 1,
                            hometown: 1,
                            relationship: 1,
                            education: 1,
                            createdAt: 1,
                            updatedAt: 1
                        }
                    }
                ],
                as: 'educationExperience'
            }
        },
        {
            $lookup: {
                from: 'educationalinformations',
                localField: 'userId',
                foreignField: 'userId',
                pipeline: [
                    {
                        $match: {
                            is_deleted: '0',
                            status: 'active',
                            type: 'education'
                        }
                    },
                    {
                        $project: {
                            title: 1,
                            employementType: 1,
                            organization: 1,
                            currentlyWorking: 1,
                            startDate: 1,
                            type: 1,
                            endDate: 1,
                            latLong: 1,
                            description: 1,
                            profileHeadline: 1,
                            media: 1,
                            bio_data: 1,
                            work: 1,
                            currentCity: 1,
                            hometown: 1,
                            relationship: 1,
                            education: 1,
                            createdAt: 1,
                            updatedAt: 1
                        }
                    }
                ],
                as: 'nonEducationExperience'
            }
        },
        {
            $lookup: {
                from: 'skills',
                localField: 'skills',
                foreignField: '_id',
                pipeline: [
                    {
                        $match: {
                            is_deleted: '0'
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            skillName: 1
                        }
                    }
                ],
                as: 'skills'
            }
        },
        {
            $project: {
                username: { $arrayElemAt: ['$userInfo.username', 0] },
                email: { $arrayElemAt: ['$userInfo.email', 0] },
                profileImage: 1,
                backgroundImage: 1,
                bio: 1,
                skills: 1,
                relationship: 1,
                interests: 1,
                experienceInfo: {
                    experience: '$educationExperience',
                    education: '$nonEducationExperience'
                },
            }
        },
        {
            $sort: {
                updatedAt: -1
            }
        }
    ]);
};


module.exports = bioDataService